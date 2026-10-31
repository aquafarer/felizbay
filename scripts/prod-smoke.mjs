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
  { path: '/', marker: 'Felizbay', desc: 'home' },
  { path: '/en/', marker: 'Felizbay', desc: 'EN mirror home' },
  { path: '/de/', marker: 'lang="de"', desc: 'localized page renders (de)' },
  {
    path: '/zh/',
    redirectsTo: '/',
    desc: 'removed locale server-redirects to EN root',
  },
  { path: '/products/', marker: 'Drop Stitch', desc: 'product listing' },
  {
    path: '/products/round-blue-drop-stitch-pool/',
    marker: 'fitg-size',
    desc: 'PDP with FitGuide size checker',
  },
  {
    path: '/products/compare/',
    marker: 'Compare Drop Stitch Inflatable Pools',
    desc: 'compare center',
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
  { path: '/find-your-pool/', marker: 'data-finder', desc: 'pool advisor quiz' },
  { path: '/support/', marker: 'Support', desc: 'support hub' },
  { path: '/returns-and-warranty/', marker: 'Warranty', desc: 'warranty policy' },
  { path: '/contact/', marker: 'Contact', desc: 'contact form' },
  { path: '/request-quotation/', marker: 'Quote', desc: 'B2B quote entry' },
  { path: '/ai-answer-center/', marker: 'AI Answer Center', desc: 'AI answer center' },
  {
    path: '/robots.txt',
    marker: 'Sitemap: https://felizbay.com/sitemap-index.xml',
    desc: 'robots.txt sitemap directive',
  },
  { path: '/sitemap-index.xml', marker: 'sitemap-entity.xml', desc: 'sitemap index' },
  { path: '/llms.txt', marker: 'Felizbay', desc: 'llms.txt knowledge manifest' },
  { path: '/ai-corpus.json', marker: 'locales', desc: 'AI corpus manifest' },
  { path: '/merchant-feed.xml', marker: '<rss', desc: 'merchant feed (0 items while checkout disabled)' },
  {
    path: '/images/pools/round-pool-s2005.webp',
    contentType: 'image/webp',
    desc: 'R2-backed product image',
  },
  { path: '/nonexistent-prod-smoke-page/', status: 404, desc: 'garbage path returns 404' },
];

/** GET with redirect following (max 3 hops) and a hard timeout.
 *  `follow: false` returns the first response (status + location) un-followed. */
const fetchRaw = (url, depth = 0, follow = true) =>
  new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'user-agent': 'felizbay-prod-smoke/1.0' }, timeout: TIMEOUT_MS }, (res) => {
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
    req.on('timeout', () => {
      req.destroy(new Error(`timeout after ${TIMEOUT_MS}ms`));
    });
    req.on('error', reject);
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
    const res = await fetchRaw(`${BASE}${check.path}`);
    if (res.status !== expected) {
      return { ok: false, reason: `expected status ${expected}, got ${res.status}` };
    }
    if (check.marker && !res.body.includes(check.marker)) {
      return { ok: false, reason: `marker not found: ${JSON.stringify(check.marker)}` };
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
