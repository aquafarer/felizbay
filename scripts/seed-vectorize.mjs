// One-shot REST seeder for the Cloudflare Vectorize knowledge index.
// Reads the build-time corpus (dist/ai-corpus.json + dist/ai-corpus/<locale>.json)
// and upserts embeddings via the Cloudflare REST API — for local/manual bootstrap
// without deploying/rebuilding through ai-worker's /api/reindex flow.
//
// Usage:
//   npm run build && npm run ai:seed
// Requires CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN in the environment.
// Optional: INDEX_NAME (default ai-index-v2), CORPUS_DIR (default ./dist), LOCALES (comma list).
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CORPUS_DIR = process.env.CORPUS_DIR ? path.resolve(process.env.CORPUS_DIR) : path.join(ROOT, 'dist');
const INDEX_NAME = process.env.INDEX_NAME || 'ai-index-v2';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const ONLY = (process.env.LOCALES || '')
  .split(',')
  .map((l) => l.trim())
  .filter(Boolean);

const EMBED_MODEL = '@cf/baai/bge-m3';
const EMBED_BATCH = 48;
const UPSERT_BATCH = 100;
const ATTEMPTS = 4;

function fail(msg) {
  console.error(`[ai-seed] ${msg}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cfFetch(url, body, attempt = 0) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    if (attempt + 1 < ATTEMPTS && (res.status === 429 || res.status >= 500)) {
      console.warn(`[ai-seed] ${res.status} on ${url.split('/').pop()} — retry ${attempt + 1}/${ATTEMPTS}`);
      await sleep(500 * 2 ** attempt);
      return cfFetch(url, body, attempt + 1);
    }
    fail(`Cloudflare API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function embedBatch(texts) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBED_MODEL}`;
  const payload = await cfFetch(url, { text: texts });
  const data = payload?.result?.data || payload?.result || [];
  if (!Array.isArray(data) || data.length !== texts.length) {
    fail(`embedding shape mismatch: got ${Array.isArray(data) ? data.length : 'non-array'}/${texts.length}`);
  }
  return data;
}

async function upsertBatch(vectors) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${INDEX_NAME}/upsert`;
  const payload = await cfFetch(url, { vectors });
  if (payload?.success === false) fail(`upsert failed: ${JSON.stringify(payload.errors || {}).slice(0, 300)}`);
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    fail('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required');
  }
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(path.join(CORPUS_DIR, 'ai-corpus.json'), 'utf8'));
  } catch {
    fail(`corpus manifest not found at ${CORPUS_DIR}/ai-corpus.json — run the full build first`);
  }
  if (manifest.model !== EMBED_MODEL) {
    fail(`corpus model mismatch: ${manifest.model} vs seeder ${EMBED_MODEL}`);
  }
  const locales = manifest.locales.filter((l) => ONLY.length === 0 || ONLY.includes(l.locale));
  if (locales.length === 0) fail('no matching locales in corpus manifest');
  console.log(`[ai-seed] index=${INDEX_NAME} model=${EMBED_MODEL} locales=${locales.map((l) => l.locale).join(',')}`);

  let total = 0;
  for (const entry of locales) {
    const file = JSON.parse(readFileSync(path.join(CORPUS_DIR, entry.file.replace(/^\//, '')), 'utf8'));
    const chunks = file.chunks || [];
    console.log(`[ai-seed] ${entry.locale}: ${chunks.length} chunks`);
    for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
      const part = chunks.slice(i, i + EMBED_BATCH);
      const vectors = await embedBatch(part.map((c) => c.text));
      const toUpsert = part.map((c, j) => ({
        id: c.id,
        values: vectors[j],
        metadata: {
          text: c.text.slice(0, 3000),
          url: c.url,
          title: c.title,
          locale: c.locale,
          type: c.type,
        },
      }));
      for (let u = 0; u < toUpsert.length; u += UPSERT_BATCH) {
        await upsertBatch(toUpsert.slice(u, u + UPSERT_BATCH));
      }
      total += part.length;
      console.log(`[ai-seed] ${entry.locale}: ${Math.min(i + EMBED_BATCH, chunks.length)}/${chunks.length}`);
    }
  }
  console.log(`[ai-seed] done — ${total} chunks upserted into ${INDEX_NAME}`);
}

main();
