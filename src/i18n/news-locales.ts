// NEWS_LOCALES — locales whose `/xx/news*` + `/xx/rss.xml` are served by the
// news-worker zone routes. Derived at BUILD time from
// `workers/news-worker/wrangler.toml` (the single source of truth), so this
// list can never drift from the worker's actual route table.
//
// SERVER/BUILD SIDE ONLY (reads the filesystem via node:fs) — never import
// from client-bundled code. Pages inline the array into their runtime scripts
// via `JSON.stringify(NEWS_LOCALES)`.
//
// Consumers use it to decide whether a locale-prefixed news link is valid:
// a news href on a non-worker locale tree would 404 (`/tr/news/…`), so those
// link to the EN root `/news/…` instead.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Build-time only (astro build/dev always run from the project root).
// NOT import.meta.url-relative: the prerender bundle relocates this module
// into dist/.prerender/, which would break the relative path.
const wranglerToml = readFileSync(join(process.cwd(), 'workers/news-worker/wrangler.toml'), 'utf8');

const prefixed = [...wranglerToml.matchAll(/pattern = "felizbay\.com\/([a-z]{2})\/news\*"/g)].map((m) => m[1]);
const hasRoot = /pattern = "felizbay\.com\/news\*"/.test(wranglerToml);

if (!hasRoot) {
  throw new Error('[news-locales] news-worker wrangler.toml lost its root felizbay.com/news* route');
}

export const NEWS_LOCALES: string[] = ['en', ...prefixed.filter((l) => l !== 'en').sort()];
