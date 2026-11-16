// Post-build CI gates (audit item 20):
//   1. Every URL listed in the generated sitemaps must exist in dist/ as an
//      index.html (no 404/308 sources by construction).
//   2. Sitemap URLs must use trailing slashes consistently.
//   3. Forbidden paths (/brand/, /v2/) must not appear in sitemaps.
//   4. <title>/meta description length checks + mojibake scan on built HTML.
//   5. Noindex regression guard (2026-11-16): generate-sitemaps.mjs excludes
//      noindex pages at generation time, so a content page accidentally marked
//      noindex would silently drop out of the sitemap with no error. This gate
//      reverses the check — every dist page that is NOT in a known-intentional
//      noindex class MUST be indexable AND listed in sitemap-entity.xml; any
//      unexpected noindex page fails the build (and vice versa: a noindex page
//      listed in any sitemap is a leak).
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
// Raw i18n key leak (audit 4 §6.2): visible text must not contain unresolved
// translation keys like "product.deliveryCard". Key namespaces mirror src/data/site/i18n-config.json.
const RAW_KEY_RE =
  /(?:^|[\s"'>(])((?:product|nav|chat|faq|404|search|checkout|cta|about|home|header|blog|tw)\.[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z0-9]+)+)(?=[\s"'<)&.,;:!?]|$)/;

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
    // Raw translation-key leak check: scan visible text only (strip script/style/tags),
    // since bundled JS legitimately references key names for lookups.
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    const keyMatch = RAW_KEY_RE.exec(visibleText);
    if (keyMatch) errors.push(`raw i18n key leak: ${rel} — ${keyMatch[1]}`);
  }

  // 5. Noindex regression guard — see header comment. Classify every built
  // page by robots meta; anything noindex outside the intentional classes is
  // an accidental deindexing (the exact failure mode this gate exists for).
  const SITE = 'https://felizbay.com';
  const entityXml = readFileSync(path.join(DIST, 'sitemap-entity.xml'), 'utf8');
  const entityLocs = new Set([...entityXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  const intentionalNoindex = (p) =>
    p === '/404.html' ||
    /^\/(keystatic|internal|login|register|admin)\//.test(p) ||
    /^\/en\/(keystatic|internal|login|register|admin)\//.test(p) ||
    p === '/zh/' ||
    p === '/ja/' ||
    p === '/ko/' ||
    p === '/en/zh/' ||
    p === '/en/ja/' ||
    p === '/en/ko/' ||
    /\/search\/$/.test(p);
  const isEnMirror = (p) => p === '/en/' || p.startsWith('/en/');
  for (const file of htmlFiles) {
    const rel = file.slice(DIST.length).replace(/\\/g, '/');
    const urlPath = rel === '/index.html' ? '/' : rel.replace(/index\.html$/, '');
    const html = readFileSync(file, 'utf8');
    const robots = /<meta\s+name="robots"\s+content="([^"]*)"/i.exec(html)?.[1] ?? '';
    const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(html)?.[1] ?? '';
    const listed = entityLocs.has(urlPath);
    if (robots.includes('noindex')) {
      // Listed despite noindex → sitemap leak.
      if (listed) errors.push(`noindex page listed in sitemap-entity.xml: ${rel}`);
      if (
        isEnMirror(rel) &&
        !/^\/en\/(zh|ja|ko)\/$/.test(urlPath) &&
        !/^\/en\/(keystatic|internal|login|register|admin)\//.test(urlPath)
      ) {
        // EN mirror must stay canonical → root counterpart, never self-referencing
        // (self-canonical + noindex would strand the page out of both indexes).
        const expected = SITE + urlPath.replace(/^\/en/, '');
        if (canonical !== expected)
          errors.push(`en-mirror canonical mismatch: ${rel} — expected ${expected}, got ${canonical || '(none)'}`);
      } else if (!isEnMirror(rel) && !intentionalNoindex(urlPath)) {
        errors.push(`unexpected noindex page (accidental deindexing?): ${rel} — robots="${robots}"`);
      }
    } else {
      // Indexable content page: must be present in the entity sitemap, or it
      // would never be discovered/crawled (silent drop-out failure mode).
      if (!listed && !intentionalNoindex(urlPath) && !isEnMirror(rel))
        errors.push(`indexable page missing from sitemap-entity.xml: ${rel}`);
    }
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
