// Post-build CI gates (audit item 20):
//   1. Every URL listed in the generated sitemaps must exist in dist/ as an
//      index.html (no 404/308 sources by construction).
//   2. Sitemap URLs must use trailing slashes consistently.
//   3. Forbidden paths (/brand/, /v2/) must not appear in sitemaps.
//   4. <title>/meta description length checks + mojibake scan on built HTML.
// Exit code 1 on any hard violation (build fails → deploy blocked).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITEMAPS = [
  'sitemap-entity.xml',
  'ai-sitemap.xml',
  'knowledge-sitemap.xml',
  'sitemap-products.xml',
  'sitemap-community.xml',
  'sitemap-media.xml',
  'sitemap-learning.xml',
];
const EXCLUDE_EXACT = new Set(['/brand/', '/v2/']);
const MOJIBAKE = /\uFFFD|u\{2014\}|镥|—\?/;

const errors = [];
const warnings = [];

function walk(dir, base, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(full, rel, out);
    else if (entry.name === 'index.html')
      out.push(rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel);
  }
}

function listHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...listHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function main() {
  if (!existsSync(DIST)) {
    console.error('[validate-dist] dist/ not found — run after astro build');
    process.exit(1);
  }

  const pagesArr = [];
  walk(DIST, '', pagesArr);
  const pageSet = new Set(pagesArr.map((p) => (p.startsWith('/') ? p : '/' + p)));

  let locCount = 0;
  for (const sm of SITEMAPS) {
    const file = path.join(DIST, sm);
    if (!existsSync(file)) {
      errors.push(`sitemap missing in dist: ${sm}`);
      continue;
    }
    const xml = readFileSync(file, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    locCount += locs.length;
    for (const loc of locs) {
      const urlPath = new URL(loc).pathname;
      if (!pageSet.has(urlPath)) errors.push(`dead sitemap URL (not in dist): ${loc}`);
      if (!urlPath.endsWith('/')) warnings.push(`missing trailing slash: ${loc}`);
      if (EXCLUDE_EXACT.has(urlPath)) errors.push(`forbidden path in sitemap: ${loc}`);
    }
  }

  // Title / description / mojibake scan on every built page.
  const htmlFiles = listHtmlFiles(DIST);
  let checked = 0;
  for (const file of htmlFiles) {
    const rel = file.slice(DIST.length).replace(/\\/g, '/');
    const html = readFileSync(file, 'utf8');
    checked++;
    const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
    const desc = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1];
    // Title limit 110 (not 90): localized (RTL) product titles legitimately reach ~106 chars.
    if (title && title.length > 110) warnings.push(`title too long (${title.length}): ${rel} — ${title.slice(0, 60)}…`);
    if (desc) {
      if (desc.length > 190) warnings.push(`description too long (${desc.length}): ${rel}`);
      else if (desc.length < 50) warnings.push(`description too short (${desc.length}): ${rel}`);
    }
    if (title && MOJIBAKE.test(title)) errors.push(`mojibake in <title>: ${rel} — ${title.slice(0, 80)}`);
    if (desc && MOJIBAKE.test(desc)) errors.push(`mojibake in description: ${rel}`);
  }

  console.log(`[validate-dist] checked ${locCount} sitemap URLs (${SITEMAPS.length} sitemaps) + ${checked} pages`);
  for (const w of warnings) console.log(`  ⚠ ${w}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  if (errors.length) {
    console.error(`[validate-dist] FAIL: ${errors.length} hard violations`);
    process.exit(1);
  }
  console.log(warnings.length ? `[validate-dist] PASS (${warnings.length} warnings)` : '[validate-dist] PASS');
}

main();
