import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const BUCKET = 'felizbay-assets';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '2ac0f11c5362bbba3a7b34693dd56ba4';
const ASSET_BASE = process.env.ASSETS_BASE_URL || 'https://assets.felizbay.com';
// Required only for the post-deploy edge-cache purge of data/*. If unset, the
// purge step is skipped (deploy still succeeds, but stale data may be cached).
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

// Directories to sync. `force: true` means always re-upload (used for data/*.json
// whose content changes on every build). The others are incremental: skipped
// when an object with the same key AND same byte size already exists in R2, so
// repeated CI runs only upload genuinely new/changed assets (saves R2 A-class
// operations, which are scarce on the free tier).
const ASSET_DIRS = [
  { dir: 'data', force: true },
  { dir: 'images', force: false },
  { dir: 'files', force: false },
];

function detectMime(filePath) {
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  if (filePath.endsWith('.pdf')) return 'application/pdf';
  if (filePath.endsWith('.gif')) return 'image/gif';
  return 'application/octet-stream';
}

async function uploadFile(filePath, r2Key, contentType) {
  const content = readFileSync(filePath);
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${encodeURIComponent(r2Key)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': contentType,
    },
    body: content,
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
}

// Returns a Map<key, size> of objects already in the bucket. The List API is a
// B-class operation (cheap, generous free quota).
async function listExisting() {
  const existing = new Map();
  let cursor;
  do {
    const params = new URLSearchParams({ per_page: '1000' });
    if (cursor) params.set('cursor', cursor);
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects?${params}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data.errors));
    for (const obj of data.result) {
      existing.set(obj.key, obj.size);
    }
    cursor = data.result_info?.cursor;
  } while (cursor);
  return existing;
}

// Purge data/* from the edge cache so the 30-day hard cache doesn't keep
// serving stale content after a deploy. Skipped if CLOUDFLARE_ZONE_ID unset.
async function purgeCache(urls) {
  if (!ZONE_ID) {
    console.log('[purge] CLOUDFLARE_ZONE_ID not set — skipping edge cache purge for data/*');
    return;
  }
  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: urls }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(JSON.stringify(data.errors));
  console.log(`[purge] Purged ${urls.length} data/* URLs from edge cache`);
}

async function main() {
  console.log('Checking existing objects in R2...');
  const existing = await listExisting();
  console.log(`Found ${existing.size} existing objects`);

  const CONCURRENCY = 12;
  let skipped = 0;

  const jobs = [];
  for (const { dir, force } of ASSET_DIRS) {
    const fullDir = path.join(PUBLIC_DIR, dir);
    const files = globSync(`${fullDir}/**/*`, { nodir: true });

    for (const file of files) {
      const relativePath = path.relative(PUBLIC_DIR, file);
      const r2Key = relativePath.replace(/\\/g, '/');

      if (!force) {
        const localSize = statSync(file).size;
        const remoteSize = existing.get(r2Key);
        // Skip when key exists AND size matches (no A-class op consumed).
        if (remoteSize !== undefined && remoteSize === localSize) {
          skipped++;
          continue;
        }
      }
      jobs.push({ file, r2Key });
    }
  }

  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      process.stdout.write(`  ${job.r2Key}\n`);
      await uploadFile(job.file, job.r2Key, detectMime(job.file));
    }
  }

  const pool = Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, () => worker());
  await Promise.all(pool);
  const uploaded = jobs.length;

  console.log(`Uploaded ${uploaded} assets, ${skipped} already existed (skipped)`);

  // data/* was force-reuploaded above; purge its edge cache so the 30-day
  // hard cache doesn't keep serving stale content after this deploy.
  const dataFiles = globSync(path.join(PUBLIC_DIR, 'data', '**', '*'), { nodir: true });
  if (dataFiles.length) {
    const urls = dataFiles.map((f) => ASSET_BASE + '/' + path.relative(PUBLIC_DIR, f).replace(/\\/g, '/'));
    await purgeCache(urls);
  }
}

main().catch(console.error);
