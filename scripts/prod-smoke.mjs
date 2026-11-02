// Production smoke test — formalizes the manual "Production spot-checks" line
// of docs/qa-checklist.md into a re-runnable release gate.
//
// Checks the DEPLOYED site (not dist/): key routes return the expected status
// with the expected content marker, machine files (robots/sitemaps/feeds) are
// live, localized routes render, removed locales serve the meta-refresh shell,
// and a garbage path 404s. Zero dependencies (node:https only).
//
// Usage:
//   node scripts/prod-smoke.mjs
//   node scripts/prod-smoke.mjs --base https://staging.example.com --timeout 20000
//
// Exit code 0 = all checks passed, 1 = at least one failure.
import https from 'node:https';

const args = process.argv.slice(2);
const readArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = readArg('base', 'https://felizbay.com').replace(/\/+$/, '');
const TIMEOUT_MS = Number(readArg('timeout', '15000'));
const CONCURRENCY = 6;

/** One smoke check. status defaults to 200; marker is an optional substring. */
const CHECKS = [
  {
    path: '/',
    markers: [
      'Felizbay',
      'data-aw-toggle-menu',
      'aria-label="Main navigation"',
      'data-aw-toggle-color-scheme',
      'cloudflareinsights',
    ],
    notMarkers: ['Real Pools in Real Backyards'],
    desc: 'home: brand, mobile menu button, main nav, theme toggle, analytics beacon; fabricated customer stories removed',
  },
  { path: '/en/', marker: 'Felizbay', desc: 'EN mirror home' },
  { path: '/de/', marker: 'lang="de"', desc: 'localized page renders (de)' },
  {
    path: '/zh/',
    redirectsTo: '/',
    desc: 'removed locale server-redirects to EN root',
  },
  {
    path: '/products/',
    markers: [
      'Retail — Buy Online',
      'Wholesale &amp; Project Collections',
      'data-catalog-section="retail"',
      'data-catalog-section="business"',
    ],
    notMarkers: ['48 standard SKUs'],
    desc: 'product listing: retail and wholesale sections split by sales channel',
  },
  {
    path: '/de/products/',
    markers: ['data-catalog-section="retail"', 'data-catalog-section="business"', 'Wholesale FOB'],
    notMarkers: ['48 standard-SKU'],
    desc: 'localized product listing: channel sections present, 48-SKU note removed',
  },
  {
    path: '/products/round-blue-drop-stitch-pool/',
    markers: ['Fixed-size retail set', 'cost to run'],
    notMarkers: ['fitg-size', 'aggregateRating', '10.0 m'],
    desc: 'retail PDP: fixed-set spec + total-cost FAQ present, no factory size checker, no fake aggregate rating',
  },
  {
    path: '/de/products/round-blue-drop-stitch-pool/',
    markers: ['FAQPage', 'cost to run'],
    desc: 'localized PDP renders FAQPage JSON-LD + FAQ content (ai_faq empty-array fallback regression)',
  },
  {
    path: '/products/round-grey-drop-stitch-pool/',
    markers: ['Fixed-size retail set'],
    notMarkers: ['fitg-size', 'aggregateRating'],
    desc: 'grey retail PDP: fixed-set spec present, no size checker, no fake rating',
  },
  {
    path: '/products/rectangular-drop-stitch-pool/',
    markers: ['fitg-size', '"sku":"SR220815"', '"@type":"Offer"'],
    desc: 'wholesale PDP keeps FitGuide size checker + per-variant FOB offers in ProductGroup hasVariant',
  },
  {
    path: '/products/compare/',
    markers: ['Compare Drop Stitch Inflatable Pools', 'single-piece online retail prices', 'data-channel="wholesale"'],
    desc: 'compare center: retail-only price table plus separate wholesale section',
  },
  { path: '/products/specs/', marker: 'FOB Qingdao', desc: 'wholesale price list' },
  { path: '/pool-ideas/', marker: 'Pool Ideas', desc: 'scenario hub' },
  {
    path: '/pool-ideas/seasonal-and-portable-pools/',
    marker: 'Seasonal',
    desc: 'seasonal scenario page',
  },
  { path: '/guides/', marker: 'Pool Buying, Setup', desc: 'guides index' },
  {
    path: '/guides/how-to-store-a-drop-stitch-pool/',
    marker: 'Store',
    desc: 'guide article',
  },
  {
    path: '/guides/how-to-choose-inflatable-pool/',
    markers: ['href="/products/round-blue-drop-stitch-pool/"', 'href="/products/rectangular-drop-stitch-pool/"'],
    desc: 'consumer buying guide deep-links to round + rectangular PDPs (relatedProducts wired)',
  },
  { path: '/find-your-pool/', marker: 'data-finder', desc: 'pool advisor quiz' },
  { path: '/support/', marker: 'Support', desc: 'support hub' },
  { path: '/returns-and-warranty/', marker: 'Warranty', desc: 'warranty policy' },
  {
    path: '/contact/',
    markers: ['Contact', 'cf-turnstile'],
    desc: 'contact form with Turnstile widget rendered (PUBLIC_TURNSTILE_SITE_KEY wired)',
  },
  { path: '/request-quotation/', marker: 'Quote', desc: 'B2B quote entry' },
  // ---- B2B pages (flagged as 404s in the 2026-11 GEO review; keep covered) ----
  { path: '/wholesale/', marker: 'Wholesale Inflatable Swimming Pools at Factory Prices', desc: 'wholesale hub' },
  { path: '/for-businesses/', marker: 'Felizbay for Business Projects', desc: 'B2B landing' },
  { path: '/oem-odm/', marker: 'Custom Inflatable Pools', desc: 'OEM/ODM page (nav-linked, was 404 in GEO review)' },
  { path: '/quality-control/', marker: 'Quality Control', desc: 'QC page (nav-linked, was 404 in GEO review)' },
  {
    path: '/manufacturing/',
    marker: 'How Every Felizbay Drop-Stitch Pool Is Built',
    desc: 'manufacturing process page',
  },
  { path: '/private-label/', marker: 'Private Label Inflatable Pools', desc: 'private label page' },
  { path: '/commercial-pools/', marker: 'Commercial Inflatable Pools', desc: 'commercial / hospitality page' },
  { path: '/ai-answer-center/', marker: 'AI Answer Center', desc: 'AI answer center' },
  {
    path: '/robots.txt',
    marker: 'Sitemap: https://felizbay.com/sitemap-index.xml',
    desc: 'robots.txt sitemap directive',
  },
  { path: '/sitemap-index.xml', marker: 'sitemap-entity.xml', desc: 'sitemap index' },
  {
    path: '/llms.txt',
    markers: ['Felizbay', 'pool-ideas/', 'guides/', '/support/'],
    desc: 'llms.txt knowledge manifest (covers guides, pool ideas, support)',
  },
  { path: '/llms-index', marker: 'Markdown Endpoint Index', desc: 'combined markdown endpoint index' },
  {
    path: '/llms/ideas/seasonal-and-portable-pools',
    marker: '# Seasonal',
    desc: 'pool idea markdown endpoint',
  },
  { path: '/ai-corpus.json', marker: 'locales', desc: 'AI corpus manifest' },
  { path: '/rss.xml', marker: '<rss', desc: 'news-worker RSS feed (worker-served, no static source)' },
  { path: '/merchant-feed.xml', marker: '<rss', desc: 'merchant feed (0 items while checkout disabled)' },
  {
    path: '/images/pools/round-pool-s2005.webp',
    contentType: 'image/webp',
    desc: 'R2-backed product image',
  },
  { path: '/nonexistent-prod-smoke-page/', status: 404, desc: 'garbage path returns 404' },
  // ---- AI infrastructure pre-flight (docs/ai-visibility-baseline.md §4) ----
  {
    path: '/llms-full.txt',
    markers: ['Felizbay', '/guides/', '/pool-ideas/', '/support/'],
    desc: 'llms-full.txt corpus (covers guides, pool ideas, support)',
  },
  { path: '/ai-sitemap.xml', marker: '<urlset', desc: 'AI sitemap' },
  {
    path: '/knowledge-sitemap.xml',
    markers: ['<urlset', '/pool-ideas/', '/guides/'],
    desc: 'knowledge sitemap (guides + pool ideas)',
  },
  {
    path: '/.well-known/entity.json',
    marker: '@context',
    desc: 'entity JSON-LD manifest',
  },
  {
    path: '/api/search',
    method: 'POST',
    body: { query: 'wholesale drop stitch pool FOB price' },
    desc: 'Vectorize search hits a guide with score > 0.6',
    validate: (res) => {
      let parsed;
      try {
        parsed = JSON.parse(res.body);
      } catch {
        return { ok: false, reason: 'response is not JSON' };
      }
      const first = parsed.results?.[0];
      if (!first) return { ok: false, reason: 'no results returned' };
      // Vectorize metadata stores URLs relative to the site root.
      const hitPath = `/${String(first.url).replace(/^\/+/, '')}`;
      if (!hitPath.startsWith('/guides/')) {
        return { ok: false, reason: `first hit is not a guide: ${first.url}` };
      }
      if (typeof first.score !== 'number' || first.score <= 0.6) {
        return { ok: false, reason: `score too low: ${first.score}` };
      }
      return { ok: true };
    },
  },
  {
    path: '/api/search',
    method: 'POST',
    body: { query: 'seasonal portable pool for winter storage' },
    desc: 'Vectorize search surfaces a pool-ideas scenario',
    validate: (res) => {
      let parsed;
      try {
        parsed = JSON.parse(res.body);
      } catch {
        return { ok: false, reason: 'response is not JSON' };
      }
      const results = Array.isArray(parsed.results) ? parsed.results.slice(0, 3) : [];
      const hit = results.find(
        (r) => typeof r.url === 'string' && r.url.replace(/^\/+/, '').startsWith('pool-ideas/') && r.score > 0.5
      );
      if (!hit) {
        return { ok: false, reason: `no pool-ideas hit in top 3: ${JSON.stringify(parsed.results?.slice(0, 3))}` };
      }
      return { ok: true };
    },
  },
  {
    path: '/llms/pages/drop-stitch-technology',
    desc: 'Standalone tech page markdown endpoint (Source self-link, no dead HTML route)',
    validate: (res) => {
      if (!res.body.includes('# Drop Stitch Pool Technology')) {
        return { ok: false, reason: 'missing title heading' };
      }
      if (!res.body.includes('/llms/pages/drop-stitch-technology')) {
        return { ok: false, reason: 'Source line does not point at the markdown endpoint' };
      }
      return { ok: true };
    },
  },
  {
    path: '/api/chat',
    method: 'POST',
    body: {},
    status: 400,
    desc: 'AI chat endpoint online (empty question 400)',
  },
  // ---- AIChat answer quality spot-check (baseline Q17, docs/ai-visibility-baseline.md §2b) ----
  {
    path: '/api/chat',
    method: 'POST',
    body: { question: 'Can I install an inflatable pool on a raised wooden deck?' },
    timeoutMs: 45000,
    desc: 'AIChat answers the raised-deck safety question',
    validate: (res) => {
      let parsed;
      try {
        parsed = JSON.parse(res.body);
      } catch {
        return { ok: false, reason: 'response is not JSON' };
      }
      const answer = typeof parsed.answer === 'string' ? parsed.answer : '';
      if (answer.length < 100) return { ok: false, reason: 'answer too short' };
      if (!/deck/i.test(answer)) return { ok: false, reason: 'answer does not address the deck question' };
      return { ok: true };
    },
  },
  // ---- Pool Advisor anonymous tracking endpoint (advisor_event, migration 0005) ----
  {
    path: '/api/track',
    method: 'POST',
    body: { type: 'invalid_smoke_type' },
    status: 400,
    desc: 'advisor tracking endpoint online (invalid type 400, no D1 write)',
  },
  // ---- Contact worker roundtrip via the honeypot path (no D1 write, no email) ----
  {
    path: '/api/contact',
    method: 'POST',
    body: {
      firstName: 'Smoke',
      lastName: 'Test',
      email: 'smoke-test@felizbay.com',
      subject: 'Production smoke test',
      message: 'Honeypot roundtrip from the production smoke gate. This submission must not be stored.',
      email_confirm: 'honeypot-filled-by-smoke',
    },
    desc: 'contact worker honeypot roundtrip (fake success, zero data written)',
    validate: (res) => {
      let parsed;
      try {
        parsed = JSON.parse(res.body);
      } catch {
        return { ok: false, reason: 'response is not JSON' };
      }
      if (parsed.success !== true || typeof parsed.id !== 'string' || parsed.id.length < 8) {
        return { ok: false, reason: `unexpected honeypot response: ${res.body.slice(0, 120)}` };
      }
      return { ok: true };
    },
  },
];

/** Request helper with redirect following (max 3 hops) and a hard timeout.
 *  Supports GET (default) and JSON-body POST. `follow: false` returns the
 *  first response (status + location) un-followed. */
const fetchRaw = (url, depth = 0, follow = true, postBody = undefined, timeoutMs = TIMEOUT_MS) =>
  new Promise((resolve, reject) => {
    const payload = postBody === undefined ? null : JSON.stringify(postBody);
    const headers = { 'user-agent': 'felizbay-prod-smoke/1.0' };
    if (payload !== null) headers['content-type'] = 'application/json';
    const options = { headers, timeout: timeoutMs, method: payload === null ? 'GET' : 'POST' };
    const req = https.request(url, options, (res) => {
      // Follow up to 3 redirects (R2 assets 301 to the assets domain).
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        if (!follow || depth >= 3) {
          resolve({ status: res.statusCode, location: res.headers.location, body: '' });
          return;
        }
        resolve(fetchRaw(next, depth + 1, follow));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'] || '',
          body: Buffer.concat(chunks).toString('utf8'),
        })
      );
    });
    if (payload !== null) req.write(payload);
    req.on('timeout', () => {
      req.destroy(new Error(`timeout after ${timeoutMs}ms`));
    });
    req.on('error', reject);
    req.end();
  });

const runCheck = async (check) => {
  const expected = check.status ?? 200;
  try {
    if (check.redirectsTo) {
      // Single un-followed request: expect 3xx whose Location matches.
      const res = await fetchRaw(`${BASE}${check.path}`, 0, false);
      if (!res.status || res.status < 300 || res.status >= 400) {
        return { ok: false, reason: `expected a redirect, got status ${res.status}` };
      }
      const target = new URL(res.location || '/', `${BASE}${check.path}`).pathname;
      if (target !== check.redirectsTo) {
        return { ok: false, reason: `expected redirect to ${check.redirectsTo}, got ${target}` };
      }
      return { ok: true };
    }
    if (check.method === 'POST') {
      const res = await fetchRaw(`${BASE}${check.path}`, 0, true, check.body ?? {}, check.timeoutMs);
      if (res.status !== expected) {
        return { ok: false, reason: `expected status ${expected}, got ${res.status}` };
      }
      if (check.validate) {
        const verdict = check.validate(res);
        if (!verdict.ok) return verdict;
      }
      return { ok: true };
    }
    const res = await fetchRaw(`${BASE}${check.path}`, 0, true, undefined, check.timeoutMs);
    if (res.status !== expected) {
      return { ok: false, reason: `expected status ${expected}, got ${res.status}` };
    }
    const markers = check.markers ?? (check.marker ? [check.marker] : []);
    const missing = markers.filter((m) => !res.body.includes(m));
    if (missing.length > 0) {
      return { ok: false, reason: `marker not found: ${JSON.stringify(missing)}` };
    }
    const notMarkers = check.notMarkers ?? [];
    const forbidden = notMarkers.filter((m) => res.body.includes(m));
    if (forbidden.length > 0) {
      return { ok: false, reason: `forbidden marker found: ${JSON.stringify(forbidden)}` };
    }
    if (check.contentType && !res.contentType.startsWith(check.contentType)) {
      return { ok: false, reason: `expected content-type ${check.contentType}, got ${res.contentType}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
};

const main = async () => {
  console.log(`[prod-smoke] base: ${BASE}, checks: ${CHECKS.length}, timeout: ${TIMEOUT_MS}ms`);
  const results = [];
  const queue = [...CHECKS];
  const worker = async () => {
    while (queue.length > 0) {
      const check = queue.shift();
      const result = await runCheck(check);
      results.push({ ...check, ...result });
      const tag = result.ok ? 'PASS' : 'FAIL';
      const detail = result.ok ? '' : ` — ${result.reason}`;
      console.log(`[${tag}] ${String(check.status ?? 200).padEnd(3)} ${check.path} (${check.desc})${detail}`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const failed = results.filter((r) => !r.ok);
  const passed = results.length - failed.length;
  console.log(`--- prod-smoke: ${passed}/${results.length} passed, ${failed.length} failed ---`);
  if (failed.length > 0) process.exit(1);
};

main();
