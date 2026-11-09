// Check that dist routes reach MIN_WORDS_TO_INDEX (sitemap inclusion floor).
// Usage (after npm run build): node tools/i18n-wordcount.mjs <route...>
// Routes are dist-relative paths without trailing slash, e.g. fr/factory/capacity
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const seoCfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/config/seo-suppress.json'), 'utf8'));
const MIN = seoCfg.minWordsToIndex ?? 400;
const routes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!routes.length)
  routes.push(
    'products',
    'guides',
    'about',
    'de/products',
    'fr/products',
    'es/products',
    'it/products',
    'cs/products',
    'sv/products',
    'da/products',
    'el/products',
    'no/products',
    'ru/products',
    'nl/products',
    'fi/products',
    'pl/products',
    'ar/products',
    'pt/products',
    'th/products',
    'he/products',
    'uk/products',
    'fa/products',
    'az/products'
  );
console.log('MIN_WORDS_TO_INDEX =', MIN);

function seo(p) {
  const html = fs.readFileSync(`${DIST}/${p}/index.html`, 'utf8');
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] ?? '';
  const noindex = /noindex/i.test(robots);
  const body = html.split('</head>')[1] || '';
  const text = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || body;
  const clean = text
    .replace(/<(script|style|nav|header|footer|template|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { noindex, words: clean.split(/\s+/).filter(Boolean).length };
}
for (const p of routes) {
  try {
    const s = seo(p);
    console.log(`${p}: noindex=${s.noindex} words=${s.words} inSitemap=${!s.noindex && s.words >= MIN}`);
  } catch {
    console.log(`${p}: FILE MISSING`);
  }
}
