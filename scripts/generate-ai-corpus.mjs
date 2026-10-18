// Post-build step: build the AI knowledge corpus from final dist/ HTML.
// Emits dist/ai-corpus/<locale>.json (one per language) + dist/ai-corpus.json
// (manifest with per-locale hashes). ai-worker fetches these at runtime to
// (re)embed the Cloudflare Vectorize index and to serve keyword fallbacks.
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'dist');
const OUT_DIR = path.join(DIST, 'ai-corpus');
const OUT_MANIFEST = path.join(DIST, 'ai-corpus.json');
const PAGES_MAX_BYTES = 25 * 1024 * 1024;

const MODEL = '@cf/baai/bge-m3';
const DIMENSIONS = 1024;
const LANGS = ['en', 'fr', 'de', 'es', 'pt', 'it', 'ar', 'ru', 'pl', 'nl', 'sv', 'no', 'el', 'fi', 'da', 'cs'];
const SKIP_PREFIXES = ['en/', 'llms/', 'internal/', 'keystatic/', 'admin/', 'login/'];
const THIN_TEXT = 400;
const CHUNK_TARGET = 1600;
const CHUNK_MAX = 3000;

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function pageTitle(html, pathKey) {
  const og = (html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]*)"/i) || [])[1];
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  const raw = decodeEntities(og || title || h1 || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return raw || pathKey;
}

function extractLines(html) {
  const body = html.split('</head>')[1] || '';
  let t = (body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || body;
  t = t.replace(/<(script|style|nav|header|footer|aside|template|noscript|svg|form)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  t = t.replace(/<!--[\s\S]*?-->/g, ' ');
  t = t.replace(/<\/(p|div|section|article|li|tr|h[1-6]|blockquote|dd|dt|figcaption|table)>/gi, '\n');
  t = t.replace(/<(br|hr)\s*\/?>/gi, '\n');
  t = t.replace(/<[^>]+>/g, ' ');
  t = decodeEntities(t);
  return t
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function pushChunk(out, cur) {
  const text = cur.trim();
  if (text) out.push(text);
}

function makeChunks(lines) {
  const out = [];
  let cur = '';
  for (const line of lines) {
    if (line.length > CHUNK_MAX) {
      pushChunk(out, cur);
      cur = '';
      let buf = '';
      for (const part of line.split(/(?<=[.!?;:])\s+/)) {
        if (part.length > CHUNK_MAX) {
          pushChunk(out, buf);
          buf = '';
          for (let i = 0; i < part.length; i += CHUNK_MAX) pushChunk(out, part.slice(i, i + CHUNK_MAX));
          continue;
        }
        if (buf && buf.length + part.length + 1 > CHUNK_TARGET) {
          pushChunk(out, buf);
          buf = part;
        } else {
          buf = buf ? buf + ' ' + part : part;
        }
      }
      pushChunk(out, buf);
      continue;
    }
    if (!cur) {
      cur = line;
    } else if (cur.length + line.length + 1 <= CHUNK_MAX) {
      cur += '\n' + line;
    } else {
      pushChunk(out, cur);
      cur = line;
    }
    if (cur.length >= CHUNK_TARGET) {
      pushChunk(out, cur);
      cur = '';
    }
  }
  pushChunk(out, cur);
  return out;
}

function isSelfCanonical(html, pathKey) {
  const canonical = (html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1] || '';
  if (!canonical) return true;
  let canonicalPath;
  try {
    canonicalPath = new URL(canonical).pathname;
  } catch {
    return true;
  }
  const norm = (s) => s.replace(/\/+$/, '').replace(/^\//, '');
  return norm(canonicalPath) === norm(pathKey);
}

function localeOf(pathKey) {
  const seg = pathKey.replace(/^\//, '').split('/')[0];
  return seg && LANGS.includes(seg) && seg !== 'en' ? seg : 'en';
}

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === 'index.html') out.push(full);
  }
}

function main() {
  if (!statSync(DIST, { throwIfNoEntry: false })?.isDirectory()) {
    console.error('[ai-corpus] dist/ not found — run after the full build chain');
    process.exit(1);
  }
  const files = [];
  walk(DIST, files);
  files.sort();

  const byLocale = new Map(LANGS.map((l) => [l, []]));
  const skipped = { enMirror: 0, prefix: 0, redirect: 0, noindex: 0, folded: 0, thin: 0 };
  const pagesIndexed = {
    en: 0,
    fr: 0,
    de: 0,
    es: 0,
    pt: 0,
    it: 0,
    ar: 0,
    ru: 0,
    pl: 0,
    nl: 0,
    sv: 0,
    no: 0,
    el: 0,
    fi: 0,
    da: 0,
    cs: 0,
  };

  for (const file of files) {
    const rel = path.relative(DIST, file).replaceAll('\\', '/');
    const pathKey = rel.replace(/index\.html$/, '').replace(/\/$/, '');
    const url = pathKey === '' ? '/' : pathKey + '/';
    if (rel.startsWith('en/')) {
      skipped.enMirror++;
      continue;
    }
    if (SKIP_PREFIXES.some((p) => rel.startsWith(p))) {
      skipped.prefix++;
      continue;
    }
    const html = readFileSync(file, 'utf8');
    if (/http-equiv="refresh"/i.test(html)) {
      skipped.redirect++;
      continue;
    }
    const robots = (html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i) || [])[1] || '';
    if (/noindex/i.test(robots)) {
      skipped.noindex++;
      continue;
    }
    const locale = localeOf(url);
    if (locale !== 'en' && !isSelfCanonical(html, url)) {
      skipped.folded++;
      continue;
    }
    const lines = extractLines(html);
    const textLen = lines.join(' ').length;
    if (textLen < THIN_TEXT) {
      skipped.thin++;
      continue;
    }
    const title = pageTitle(html, url);
    const type = url.startsWith('/products/') ? 'product' : 'page';
    const chunks = makeChunks(lines);
    chunks.forEach((text, i) => {
      byLocale.get(locale).push({
        id: fnv1a(`${locale}:${url}#${i}`),
        locale,
        url,
        title,
        text,
        type,
      });
    });
    pagesIndexed[locale]++;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model: MODEL,
    dimensions: DIMENSIONS,
    locales: [],
  };
  let totalChunks = 0;
  let totalBytes = 0;
  let oversize = false;

  for (const locale of LANGS) {
    const chunks = byLocale.get(locale);
    if (chunks.length === 0) continue;
    const content = JSON.stringify({ locale, model: MODEL, dimensions: DIMENSIONS, chunks });
    const bytes = Buffer.byteLength(content, 'utf8');
    const outPath = path.join(OUT_DIR, `${locale}.json`);
    writeFileSync(outPath, content, 'utf8');
    if (bytes >= PAGES_MAX_BYTES) {
      console.error(`[ai-corpus] FATAL: ${locale}.json is ${(bytes / 1048576).toFixed(1)} MiB (Pages limit 25 MiB)`);
      oversize = true;
    }
    manifest.locales.push({
      locale,
      file: `/ai-corpus/${locale}.json`,
      hash: fnv1a(content),
      chunks: chunks.length,
      bytes,
    });
    totalChunks += chunks.length;
    totalBytes += bytes;
  }

  writeFileSync(OUT_MANIFEST, JSON.stringify(manifest), 'utf8');
  if (oversize) process.exit(1);

  console.log(
    `[ai-corpus] ${manifest.locales.length} locales, ${totalChunks} chunks, ${(totalBytes / 1048576).toFixed(1)} MiB total`
  );
  for (const l of manifest.locales) {
    console.log(
      `  ${l.locale}: ${pagesIndexed[l.locale]} pages, ${l.chunks} chunks, ${(l.bytes / 1048576).toFixed(2)} MiB`
    );
  }
  console.log(
    `[ai-corpus] skipped: ${skipped.enMirror} /en/ mirrors, ${skipped.prefix} excluded paths, ${skipped.redirect} redirects, ${skipped.noindex} noindex, ${skipped.folded} folded duplicates, ${skipped.thin} thin pages`
  );
}

main();
