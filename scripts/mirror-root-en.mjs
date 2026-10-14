// Post-build step: mirror English pages from dist/en/* to the site root.
// The site declares EN canonical/hreflang/sitemap URLs at the root (see
// src/i18n/utils.ts localizePath), but dynamic [lang] routes only emit
// dist/en/... pages. This script materialises the root-level EN copies so
// root URLs return 200. Root copies are only created when no root page
// already exists (static root pages win).
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const EN = path.join(DIST, 'en');

function walk(dir, base, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(full, rel, out);
    else out.push(rel);
  }
}

function main() {
  if (!existsSync(EN)) {
    console.error('[root-en] dist/en not found — run after astro build');
    process.exit(1);
  }
  const allEn = [];
  walk(DIST, '', allEn);
  const enSet = new Set(allEn.map((f) => f.replaceAll('\\', '/')));

  const html = allEn.filter((f) => f.replaceAll('\\', '/').startsWith('en/') && /\/index\.html$/.test(f));
  const mirrored = [];
  const skipped = [];
  for (const f of html) {
    const slashed = f.replaceAll('\\', '/');
    const rootRel = slashed.replace(/^en\//, '');
    if (existsSync(path.join(DIST, rootRel))) {
      skipped.push(rootRel);
      continue;
    }
    mirrored.push(rootRel);
  }

  // Map of root paths available (static or excluded from mirroring on purpose).
  const availableRoot = new Set();
  for (const f of enSet) {
    if (!f.startsWith('en/')) continue; // not in en tree
    const rootRel = f.replace(/^en\//, '');
    if (existsSync(path.join(DIST, rootRel))) availableRoot.add(normalizePath('/' + rootRel));
  }
  for (const r of mirrored) availableRoot.add(normalizePath('/' + r));

  let count = 0;
  const written = [];
  for (const rootRel of mirrored) {
    const src = path.join(DIST, 'en', rootRel);
    const dst = path.join(DIST, rootRel);
    mkdirSync(path.dirname(dst), { recursive: true });
    let htmlContent = readFileSync(src, 'utf8');
    htmlContent = rewriteLinks(htmlContent, availableRoot);
    writeFileSync(dst, htmlContent, 'utf8');
    written.push('/' + rootRel.replace(/\/index\.html$/, '/'));
    count++;
  }

  console.log(`[root-en] mirrored ${count} EN pages to root (${skipped.length} existed as static root pages)`);
  for (const w of written) console.log('  + ' + w);
}

// Astro static redirects (meta-refresh pages from astro.config redirects)
// only exist at the root, so /en/<path> twins are missing. Mirror them so
// localizeHref() targets (which add the en prefix) never 404.
function mirrorRedirectPages() {
  const all = [];
  walk(DIST, '', all);
  let count = 0;
  for (const f of all) {
    const slashed = f.replaceAll('\\', '/');
    if (slashed.startsWith('en/')) continue;
    // Redirect pages inside localized trees (/de/x/, /fr/x/, ...) must not be
    // mirrored: /en/ mirrors root-level (EN) pages only.
    if (/^(fr|de|es|pt|ar|it|ru|pl|nl|sv|no|el|fi|da)\//.test(slashed)) continue;
    if (!/\/index\.html$/.test(slashed)) continue;
    const src = path.join(DIST, f);
    const content = readFileSync(src, 'utf8');
    if (!/http-equiv="refresh"/.test(content)) continue;
    const enRel = 'en/' + slashed;
    const dst = path.join(DIST, enRel);
    if (existsSync(dst)) continue;
    mkdirSync(path.dirname(dst), { recursive: true });
    writeFileSync(dst, content, 'utf8');
    count++;
  }
  console.log(`[root-en] mirrored ${count} redirect pages to /en/`);
}

function normalizePath(f) {
  let s = f.replace(/\\/g, '/');
  s = s.startsWith('/') ? s : '/' + s;
  s = s.replace(/\/?index\.html$/, '/');
  s = '/' + s.replace(/^\/+/, '');
  s = s.replace(/\/{2,}/g, '/');
  if (!s.endsWith('/')) s += '/';
  return s;
}

// Worker-served routes that resolve live at the root but have no dist/ twin
// (news-worker handles /news*, /{lang}/news*, rss). Their /en/ variants do not
// exist anywhere, so mirrored root pages must rewrite them like root twins.
const DYNAMIC_ROOT_ROUTES = new Set(['/news/']);

function rewriteLinks(html, availableRoot) {
  // Rewrite /en/<path> references to /<path> only when the root twin exists
  // (either already in dist, mirrored in this pass, or a worker route listed
  // in DYNAMIC_ROOT_ROUTES). Anything else keeps its /en/ target so the
  // copied page never introduces new dead links.
  return html.replace(/((?:href|src|action|content)=")\/en\/([^"]*)(?=["#?])/g, (m, attr, rest) => {
    const pathOnly = rest.split(/[?#]/, 1)[0];
    const norm = normalizePath('/' + pathOnly);
    if (!availableRoot.has(norm) && !DYNAMIC_ROOT_ROUTES.has(norm)) {
      return m;
    }
    return attr + '/' + rest;
  });
}

// The /en/ tree itself also carries /en/news links (raw '/' + lang + href
// expressions in [lang] pages). news-worker has no /en/news route, so rewrite
// those to the root /news path inside dist/en/*.html as well.
function rewriteDynamicRoutesInEnTree() {
  const all = [];
  walk(DIST, '', all);
  let count = 0;
  for (const f of all) {
    if (!f.replaceAll('\\', '/').startsWith('en/')) continue;
    if (!/\.html$/.test(f)) continue;
    const p = path.join(DIST, f);
    let html = readFileSync(p, 'utf8');
    const next = html.replace(/((?:href|src|action|content)=")\/en\/(news(?:[/?#][^"]*)?)(?=")/g, '$1/$2');
    if (next !== html) {
      writeFileSync(p, next, 'utf8');
      count++;
    }
  }
  console.log(`[root-en] rewrote /en/news -> /news in ${count} /en/ pages`);
}

main();
mirrorRedirectPages();
rewriteDynamicRoutesInEnTree();
