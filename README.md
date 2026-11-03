# Felizbay — Astro 7 Multilingual Platform

Multilingual (37 languages) water sports equipment site for **Felizbay**, built on [Astro 7](https://astro.build) (Vite 8 / Rolldown, Rust compiler), pure static generation (`output: 'static'`), deployed to **Cloudflare Pages + 5 Workers**.

**Scale:** ~645 pages across 37 languages, 0 build errors
**Domains:** `felizbay.com` (production; `www.felizbay.com/*` → apex via Cloudflare Redirect Rule, 301 single-hop, path-preserving), `assets.felizbay.com` (R2 asset storage)

**2026-11 architecture snapshot** (latest changes): purchasability round — hot-tub retail PDP bound to the fixed factory item RS2018 (Ø 2 × 0.8 m, 10 cm; `fixedSetSize` field in `product-page-content.ts` + `fixedSize` prop on `FitGuide.astro`: fixed sets cite specs above, blue/grey sets say dimensions are confirmed with your order) · blanket package-contents claims scoped to per-set lists across `products/index`, `returns-and-warranty`, `faq.ts`, `guides.ts`, `best-drop-stitch`, `product-business-data.ts`, `pool-ideas.ts` (unsourced satisfaction/ticket numbers, "heats faster", "booking magnet" removed) · 72 home/about YAMLs synced across 36 languages (swim-pool-set scoping, stale "48 standard SKUs" home-FAQ claims purged, compare row-1 href → `/products/`) · `/find-your-pool/` rewritten as dual entry: "Shop a Retail Set" (3 static cards + 4 honest boundary cards) + "Plan a Business or Project Pool" (planner logic, `data-finder` tracking, quote CTAs via `/contact/?product=` prefill) · prod-smoke 57 → 58 checks (RS2018 binding, finder dual entry, returns wording); blocked on admin sign-off: blue/grey 12-field spec tables, grey +$100 rationale, $499 spa package contents, RS2018 photos · dependency security sweep — npm audit 1 critical/16 high/2 low → **0/0/0** (better-auth 1.7.3→1.7.15 OAuth-proxy impersonation fix, zod 4.5.4→4.6.7 memory-exhaustion fix, astro 7.4.4/vite 8.3.5/astro-icon 1.2.0/sharp/wrangler/undici in-range bumps; 20 moderate remain, all dev-only tooling whose audit "fixes" are semver-major downgrades — do not apply blindly) · `gen-icon-svgs.cjs` switched to dynamic `import()` (@iconify/utils ≥3 is ESM-only, no `lib/index.cjs`) · Cloudflare Web Analytics beacon live (`CF_ANALYTICS_TOKEN` secret, smoke-gated) · GEO advisor events + KPI panel (D1 `advisor_event`, migration 0005) · PDP TCO FAQs added + `[lang]` product FAQ empty-array fix (FAQPage JSON-LD restored on 185 localized pages) · dependabot backlog cleared (Actions checkout/setup-node v7 + github-script v9, prettier-plugin-astro 1.1.1 — 241-file whitespace reformat, `LEGACY_REDIRECTS` long removed) · GEO third-round review shipped — per-variant FOB `Offer`s inside wholesale ProductGroup `hasVariant` (EN + `[lang]` PDPs, prices from `pool-catalog.ts` SSOT), consumer-guide → PDP deep links (`relatedProducts`), new guide `/guides/inflatable-pool-operating-costs/` (17th consumer guide), `/pool-volume-calculator/` tool page (client-side, noscript formula fallback), interactive 48-SKU factory-size filter on `/products/compare/`, hand-maintained `llms.txt` re-synced + structural drift guard in smoke (slug coverage + hand-written counts vs SSOT) · GEO baseline answer key + recording template delivered (`docs/ai-visibility-baseline.md` §7–§8, 26 questions × 6 platforms) · quarterly retest vs 2026-10-21 baseline (16 checks, `docs/technical-audit-2026-10.md` §5) uncovered the P1-C @graph entity hub was never wired — wired same-day: home pages (`index` + `[lang]/index`) pass `disableGlobalLd` and emit a single `@graph` (Organization+ManufacturingBusiness dual @id hub + WebSite + Brand + Person + FAQPage + ItemList) through a new `JsonLd` `graph` prop; non-home pages keep the Layout global blocks · `scripts/prod-smoke.mjs` now 57 release checks.

**2026-10 architecture snapshot** (previous): P6 WebP image migration — 15 product images >100KB converted to WebP 1600px q82 (18.5MB → 0.85MB, -97%), 215 refs × 97 files updated, Lighthouse product-page perf 46 → 67 live (LCP 15.3s → 3.5s) · honeypot false-positive fix — `Contact.astro` page JS strips `email_confirm` from the payload before submit (browsers/password managers autofilled the field and silently dropped real inquiries; post-mortem in `docs/technical-audit-2026-10.md` §2.1) · R2 auto-prune — `fast-upload-r2.mjs` deletes stale R2 objects (`data/`, `images/`, `files/` prefixes) on every deploy, guarded (>200 stale aborts, prune failure never fails deploy) · technical audit record — `docs/technical-audit-2026-10.md` (48/50 audit findings, inquiry T1–T5 tests, www 301 verification), AI visibility protocol — `docs/ai-visibility-baseline.md`.

**i18n translation milestone (2026-08-31):** 14 languages × 1,721 keys fully aligned (0 missing/extra) · 3,807 sameAsEn keys translated via Google Translate API (primary) + MyMemory (backup) · 2,456 orphan keys cleaned from ar/no/el/fi · 252/252 page YAMLs translated (14 langs × 18 pages) · EN 404.explore fix propagated · remaining 808 sameAsEn = 540 technical terms + 109 cognates + 29 brand names + 124 short words/numbers (all verified correct). Translation scripts: `scripts/translate-i18n-keys.mjs` (`--dry-run`/`--force` flags).

---

## 0. Quick Start — How to Understand This Site (AI & Newcomer Guide)

Read in this order to grasp the whole system fastest (≈10 minutes):

| #   | Read this first        | What you learn                                                                                           |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | `AGENTS.md`            | Agent operating rules: build/check commands, iron rules (encoding, gates), conventions                   |
| 2   | `TECH.md`              | Full Chinese tech deep-dive: i18n system, product pages, Workers, R2, common pitfalls                    |
| 3   | `README.md` §1–6       | Architecture overview, tech stack, directory map, Workers, routing, build pipeline                       |
| 4   | `README.md` §7–9       | SEO/GEO strategy, content pipeline, navigation system                                                    |
| 5   | `astro.config.ts`      | All routes, locale-removal redirects (`/zh/`,`/ja/`,`/ko/`), compressHTML, Vite plugins (yaml, tailwind) |
| 6   | `src/config.yaml`      | Site-wide configuration (loaded as `astrowind:config` virtual module)                                    |
| 7   | `package.json` scripts | Every pipeline entry point (build, deploy, check, gates)                                                 |

**Where each piece of architecture lives (file map):**

| Topic                                | Location                                                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing & redirects                  | `astro.config.ts` (routes + zh/ja/ko locale-removal redirects in the `redirects` object)                                                                             |
| Locale detection / middleware        | `functions/_middleware.ts` (Pages Functions), `src/i18n/utils.ts`                                                                                                    |
| Languages (37) & degraded set        | `src/i18n/config.ts`, `src/i18n/root-only.ts`, `src/i18n/v2-converged.ts`                                                                                            |
| Navigation (YAML-driven, 37 langs)   | `src/navigation.ts`, `src/config.yaml`, per-lang overrides; editor at `src/pages/keystatic/navigation.astro`                                                         |
| Site configuration                   | `src/config.yaml` (SITE/I18N/METADATA/APP_BLOG/UI/ANALYTICS) via `vendor/integration/`                                                                               |
| Content collections                  | `src/content.config.ts` (glob loader), posts in `src/data/post/`                                                                                                     |
| Page content per language            | `src/data/pages/{lang}/` (translation YAML) → build-time `src/i18n/generated/pages/*.ts` → `src/i18n/page-content.ts` (`getPageContent`)                             |
| Site-level YAML (`site-*` keys)      | `src/data/site/*.yaml` → build-time `src/i18n/generated/site-data.ts` (2.2 MiB; `content-v2*` excluded — see `src/data/content-v2.ts`)                               |
| Full build payload (JSON)            | `src/i18n/generated/page-content.json` (~6.8 MiB, gitignored; **never** emitted into `public/` — Pages 25 MiB limit)                                                 |
| UI translations                      | `src/i18n/generated/ui-all.ts` + `src/i18n/generated/ui/{lang}.ts` (auto-generated); runtime copy at `public/data/i18n-config.json`                                  |
| Product data (SSOT)                  | `src/data/products.ts` (63 products), translations in `product-texts.ts`                                                                                             |
| JSON-LD entity hub (single `@graph`) | `src/utils/schema-graph.ts` + `src/config/facts.json` (global blocks in `Layout.astro`)                                                                              |
| Shared page content components       | `src/components/randdcenter/*.en.astro` (EN fallback shared across languages)                                                                                        |
| Tailwind theme & utilities           | `src/assets/styles/tailwind.css` (@theme/@variant/@plugin), colors/fonts in `src/components/CustomStyles.astro`                                                      |
| SEO/GEO files                        | `src/pages/search-index.json.ts` (static search), `scripts/generate-sitemaps.mjs`, `scripts/geo-build.mjs`                                                           |
| Workers (5)                          | `workers/{contact,ai,admin,news,automation}-worker/` (+ `workers/shared/`); routes in each `wrangler.toml`                                                           |
| D1 migrations                        | `migrations/` (0000–0005: init, news, rate_limit, inquiry_ip, inquiry_routing, advisor_event), applied by CI / `wrangler d1 migrations apply`                        |
| CI/CD                                | `.github/workflows/{ci,deploy,seo-gate}.yml`                                                                                                                         |
| Static quality gates                 | `scripts/validate-dist.mjs`, `scripts/fold-untranslated-canonical.mjs`, `scripts/05_ci_gate.py`                                                                      |
| Legacy leftovers (do not touch)      | `scripts/patch-worker.mjs` (subdomain routing for `output: 'server'` — dead under `static`), `scripts/_patch-pages.cjs` (manual tool)                                |
| Image dimension SSOT                 | `src/data/site/image-dimensions.json` (36 entries, rebuilt by `scripts/generate-image-dimensions.mjs`; injected at build via `vendor/integration/img-dimensions.ts`) |
| R2 asset upload + auto-prune         | `scripts/fast-upload-r2.mjs` (uploads `public/` assets, prunes stale R2 objects each deploy)                                                                         |
| Technical audit & test records       | `docs/technical-audit-2026-10.md` (audit + inquiry T1–T5 + post-mortems), `docs/ai-visibility-baseline.md` (AI visibility protocol)                                  |

> **For AI agents:** always run `npm run check` + `npm run build` after changes and re-verify the gates listed in `AGENTS.md` (hreflang/canonical/link/translation-gap scans, zero U+FFFD).

---

## 1. Architecture Overview

```
Request → felizbay.com/{lang}/{path}
              ↓
    ┌──────────────────────┐
    │ Cloudflare CDN       │  ← Brotli/gzip, HTTP/3, WAF
    │  www.* → apex 301    │  ← Redirect Rule (single-hop, path-preserving)
    └──────────────────────┘
              ↓
    ┌──────────────────────┐
    │ Routes:              │
    │  felizbay.com/*    → Pages (static HTML via Cloudflare Pages)
    │  /api/contact*      → contact-worker
    │  /news*, /rss.xml   → news-worker (D1-backed news + RSS)
    │  /api/chat*, /ask*  → ai-worker
    │  /api/admin/*       → admin-worker
    │  /api/auth/*        → admin-worker (better-auth)
    │  /api/automation/*  → automation-worker (cron 0 2 * * * + manual trigger)
    └──────────────────────┘
              ↓
    ┌──────────────────────┐
    │ Pages Functions      │  ← _middleware.ts
    │  - Locale detection  │     (cookie → geo-ip → Accept-Language)
    │  - R2 asset redirect │     (/images/* → assets.felizbay.com)
    │  - Security headers  │
    └──────────────────────┘
              ↓
    ┌──────────────────────┐
    │ R2 Buckets:          │
    │  felizbay-assets   → Static images/files/PDFs
    │  felizbay-data     → SEO/GEO data, search index, rules
    └──────────────────────┘
```

All pages are pre-rendered at build time (pure SSG, no SSR adapter). API Workers handle dynamic requests at the edge.

All locale URLs use **path-based** format: `felizbay.com/fr/products`, `felizbay.com/de/guides`.

---

## 2. Tech Stack

| Layer           | Technology                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------- |
| Framework       | Astro 7.4 (`output: 'static'`, Vite 8 / Rolldown)                                             |
| Styling         | Tailwind CSS v4 via `@tailwindcss/vite` plugin                                                |
| Icons           | tabler (via astro-icon)                                                                       |
| Fonts           | Inter Variable (fontsource)                                                                   |
| AI              | Workers AI (bge-m3 embeddings, llama-3.2-3b-instruct)                                         |
| Vector DB       | Cloudflare Vectorize (`ai-index-v2`, 1024-dim cosine)                                         |
| Admin CMS       | Keystatic (GitHub API-backed via admin-worker)                                                |
| Contact         | Resend email + Turnstile captcha (via contact-worker)                                         |
| Auth            | better-auth (Google OAuth, D1-backed sessions, Turnstile)                                     |
| Frontend Host   | Cloudflare Pages (Direct Upload)                                                              |
| Backend Workers | 5 Workers: contact, ai, admin, automation, news                                               |
| Database        | Cloudflare D1 (`Felizbay-db`: inquiries, news, rate_limit, advisor_event, auth)               |
| Asset Storage   | Cloudflare R2 (assets + data buckets)                                                         |
| CI/CD           | GitHub Actions (ci.yml PR gate + deploy.yml on main + ai-index.yml post-deploy index rebuild) |
| SEO/GEO         | llms.txt (37 langs), llms-full.txt, entity.json, JSON-LD, sitemap                             |
| Compression     | Cloudflare edge (Brotli/gzip)                                                                 |
| MDX             | @astrojs/mdx                                                                                  |

---

## 3. Directory Structure

```
/
├── src/
│  ├── pages/
│  │  ├── [lang]/                    # Localized pages (fixed set, all 36 locales)
│  │  │  ├── index.astro             # Homepage (SSG)
│  │  │  ├── about.astro             # About page
│  │  │  ├── contact.astro           # Contact
│  │  │  ├── faq.astro               # FAQ
│  │  │  ├── search.astro            # Client-side search
│  │  │  ├── privacy.astro           # Privacy policy (legal)
│  │  │  ├── terms.astro             # Terms and conditions (legal)
│  │  │  ├── disclaimer.astro        # Medical disclaimer (legal)
│  │  │  └── products/               # Localized product pages
│  │  ├── guides/                    # 17 consumer + 6 B2B guide articles (EN)
│  │  ├── pool-ideas/                # 15 scenario pages + hub (EN)
│  │  ├── products/                  # Product catalog: index, [slug], specs, compare
│  │  ├── llms/                      # AI-readable markdown endpoints
│  │  │  ├── guides/[slug].ts        # 17 consumer guide markdown docs
│  │  │  ├── procurement/[slug].ts   # 6 B2B guide markdown docs
│  │  │  ├── ideas/[slug].ts         # 15 pool-idea scenario markdown docs
│  │  │  ├── products/[slug].ts      # Product markdown
│  │  │  ├── pages/[slug].ts         # Standalone page markdown
│  │  │  └── v2/[slug].ts            # V2 knowledge markdown
│  │  ├── llms-index.ts              # Combined markdown endpoint index (/llms-index)
│  │  ├── ai-answer-center/          # AI answer center
│  │  ├── keystatic/                 # Admin panel (30+ CMS editor pages, incl. link-refactor, validate-links, inquiries, users)
│  │  ├── internal/                  # GEO/SEO dashboards
│  │  ├── find-your-pool.astro       # Pool finder: retail sets + business planner dual entry
│  │  ├── pool-volume-calculator.astro # Pool volume calculator (client-side, noscript fallback)
│  │  ├── support.astro              # After-sales support hub
│  │  ├── returns-and-warranty.astro # Returns & warranty policy
│  │  ├── best-drop-stitch-inflatable-pools.astro # Editorial top-picks page
│  │  ├── for-businesses.astro       # B2B hub
│  │  ├── oem-odm.astro              # OEM/ODM page
│  │  ├── wholesale.astro            # Wholesale program
│  │  ├── private-label.astro        # Private label program
│  │  ├── commercial-pools.astro     # Commercial pool solutions
│  │  ├── manufacturing.astro        # Manufacturing process
│  │  ├── quality-control.astro      # Quality control
│  │  ├── request-quotation.astro    # RFQ page (B2B fields: application, country, material, uploads)
│  │  ├── search.astro / search-index.json.ts # Client-side search
│  │  ├── faq.astro / about.astro / contact.astro / 404.astro
│  │  ├── privacy.astro / terms.astro / disclaimer.astro  # Legal
│  │  ├── login.astro / register.astro / admin.astro      # Auth pages
│  │  └── manifest.json.ts           # PWA manifest
│  ├── components/
│  ├── layouts/
│  ├── lib/
│  ├── i18n/
│  ├── data/
│  │  ├── products.ts               # Product data SSOT (5 retail products)
│  │  ├── product-texts.ts          # Translated product descriptions (8 seed langs: fr/de/es/pt/it/ru/pl/ar)
│  │  ├── product-business-data.ts  # Commercial product tagging (use case, bestFor, ROI)
│  │  ├── product-compliance.ts     # Product compliance data
│  │  ├── product-page-content.ts   # Product page structured content
│  │  ├── pool-catalog.ts           # Factory pool catalog (series + SKU items, size tables)
│  │  ├── pool-ideas.ts             # 15 scenario pages SSOT (PoolIdea)
│  │  ├── guides.ts                 # 17 GuideRecord SSOT
│  │  ├── procurement-guides.ts     # 6 B2B guide records
│  │  ├── faq.ts                    # FAQ entries
│  │  ├── customer-cases.ts         # Customer case records
│  │  ├── standalone-pages.ts       # Standalone page records
│  │  ├── content-v2.ts             # V2 content records (incl. business-guide articles)
│  │  ├── knowledge-graph.ts        # AI knowledge graph + business entity relationships
│  │  ├── site/image-dimensions.json # Image dimension SSOT (36 entries, rebuilt each build)
│  │  ├── geo/                      # GEO source data
│  │  │  └── entity.json            # Schema.org Organization entity
│  │  └── pages/                    # Page YAML content (root = EN, subdir = per locale)
│  │  │  ├── about.yaml / contact.yaml / home.yaml / request-quotation.yaml
│  │  │  ├── de/                    # Per-locale page content
│  │  │  ├── fr/
│  │  │  └── ...
│  ├── content/
│  ├── middleware.ts                 # Astro locale middleware
│  └── config.yaml                  # Site configuration
├── public/
│  ├── llms.txt                     # Curated AI knowledge manifest (hand-maintained, links all content)
│  ├── llms-full.txt                # Full AI knowledge base (auto-generated Site Pages + Product Catalog)
│  ├── ai-sitemap.xml               # Curated AI section sitemap (20 top sections)
│  ├── knowledge-sitemap.xml        # Knowledge content sitemap (guides + pool-ideas + FAQ)
│  └── .well-known/
│       └── entity.json             # Schema.org Organization (AI entity)
├── functions/
│  └── _middleware.ts                # Cloudflare Pages Functions middleware (locale + R2 redirect)
├── workers/
│  ├── contact-worker/              # Contact form API (D1 + Turnstile + Resend)
│  │  ├── index.ts
│  │  └── wrangler.toml
│  ├── ai-worker/                   # AI chat + embedding + vector search
│  │  ├── index.ts
│  │  └── wrangler.toml
│  ├── admin-worker/                # better-auth + GitHub CRUD + D1 (inquiries)
│  │  ├── index.ts
│  │  └── wrangler.toml
│  ├── news-worker/                 # D1-backed news + RSS + news sitemap
│  │  ├── index.ts
│  │  └── wrangler.toml
│  └── automation-worker/           # Cron: D1 cleanup + IndexNow + GEO pipeline
│     ├── src/
│     │  ├── index.ts
│     │  ├── cron.ts
│     │  ├── db-cleanup.ts
│     │  ├── indexnow.ts
│     │  ├── geo-generator.ts
│     │  ├── gsc-fetch.ts
│     │  ├── rule-engine.ts
│     │  ├── task-export.ts
│     │  └── geo-score.ts
│     └── wrangler.toml
├── workers/shared/                 # Shared worker code (auth.ts, schema.ts, news-render.ts, client.ts, assert-admin.ts)
├── migrations/                     # D1 migrations 0000–0005 (inquiry, news, rate_limit, advisor_event, better-auth tables)
├── docs/                           # technical-audit-2026-10.md (audit + inquiry test record), ai-visibility-baseline.md (AI visibility protocol)
├── scripts/                        # Build & utility scripts (60+ files)
├── .github/workflows/ci.yml        # PR quality gate (check + build + worker dry-runs)
├── .github/workflows/deploy.yml    # Main-branch deploy pipeline (Pages + R2 + D1 + Workers + purge)
├── .github/dependabot.yml          # Weekly dependency updates (npm + GitHub Actions)
├── wrangler.toml                   # Root config (R2 binding only)
└── astro.config.ts                 # Astro build config
```

---

## 4. Workers

### 4.1 contact-worker (felizbay-contact)

- **Route:** `felizbay.com/api/contact*`
- **Methods:** `POST`
- **Bindings:** `DB` (D1 — `Felizbay-db`), `DATA_BUCKET` (R2 — `felizbay-data`, inquiry attachments)
- **Features:**
  - JSON + HTML form body parsing with validation (firstName, lastName, company, address, zip, country, email, tel, subject, message)
  - **Multipart file upload** (optional `file` field): max 20 MB; extension allow-list (png, jpg, jpeg, svg, webp, pdf, ai, psd, dwg, dxf, zip); magic-number content sniffing per extension; stored to R2 at `inquiry-files/{uuid}.{ext}` before the D1 insert, with the key saved in the `inquiry.logoKey` column
  - Email validation + `SPAM_KEYWORDS` filtering
  - **Honeypot** (`email_confirm` field): returns HTTP 200 with a fake UUID, writes nothing. **Client-side guard (2026-10):** `Contact.astro` page JS deletes `email_confirm` from the fetch payload and clears the DOM input before submit — browsers/password managers autofill the off-screen field despite `autocomplete="off"`, which silently dropped real inquiries (post-mortem: `docs/technical-audit-2026-10.md` §2.1). The server honeypot now only catches raw-HTTP bots.
  - **Cloudflare Turnstile** verification (`verifyTurnstile`) when `TURNSTILE_SECRET_KEY` is set
  - **Rate limit**: max 5 submissions per IP per hour via the D1 `rate_limit` table — returns HTTP 429 + `Retry-After`
  - Submission stored in D1 `inquiry` table; IP + User-Agent captured
  - Resend API email sending with `Reply-To` set to the submitter (attachment name included when a file was uploaded)
  - CORS headers
- **Secrets:** `CONTACT_RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_FROM_EMAIL`, `CONTACT_FROM_NAME`, `TURNSTILE_SECRET_KEY`

### 4.2 ai-worker (felizbay-ai)

- **Routes:** `felizbay.com/api/chat*`, `/api/ask*`, `/api/search*`, `/api/embed*`, `/api/reindex*`, `/api/ai/*`
- **Bindings:** `AI` (Workers AI), `VECTORIZE` (ai-index-v2), `DATA_BUCKET` (R2 — reindex state/meta/log + rate-limit counters, answer cache, daily quota)
- **Cron:** daily 03:00 UTC — R2 housekeeping (stale rate-limit windows, old cache days, quota files), then resumes any pending knowledge-index rebuild (hash-skipped when the corpus is unchanged)
- **Knowledge corpus:** generated at build time by `scripts/generate-ai-corpus.mjs` from the final `dist/` HTML (self-canonical, non-thin pages only) → `dist/ai-corpus/<locale>.json` + `dist/ai-corpus.json` manifest with per-locale hashes
- **Abuse protection:**
  - **Rate limits** (per-IP fixed windows in R2, fail-open, HTTP 429 + `Retry-After`): ask/chat 10 per 10 min, search 60 per min, embed 10 per 10 min
  - **Answer cache** (6 h TTL, R2 day-bucketed keys): first-turn AI-mode answers are cached and replayed without hitting Workers AI
  - **Daily embed budget** (`DAILY_EMBED_BUDGET` = 6000): reindex pauses with HTTP 503 + `{paused: "budget", resumeAt}` when exhausted; the daily cron and `ai-index.yml` both resume gracefully
- **Endpoints:**
  - `POST /api/chat` — Conversational chat with RAG (Vectorize + llama-3.2-3b-instruct)
  - `POST /api/ask` — Product recommendation with sources; returns `{answer, matches, sources, mode}` where `mode` is `ai` (vector RAG), `keyword` (corpus keyword fallback) or `none`
  - `POST /api/search` — Vector similarity search (top 20 results)
  - `POST /api/embed` — Text embedding via bge-m3 (1024-dim)
  - `POST /api/reindex` — Token-gated incremental rebuild (`Authorization: Bearer REINDEX_TOKEN`; 404 while the secret is unset); processes ~1200 chunks per call against the published corpus and returns `{done, remaining}` so callers can loop; deletes stale chunk IDs per locale; 503 `paused-budget` when the daily embed budget is spent
  - `GET /api/quota` — Usage status: daily counters (AI answers, reindex embeds, remaining embed budget) + configured limits
  - `GET /api/sitemap` — AI sitemap (root + 14 languages)
- **Secrets:** `REINDEX_TOKEN` (synced by deploy.yml; also used by ai-index.yml)
- **CI:** deploy.yml ensures `ai-index-v2` exists (1024-dim cosine) before deploying workers; `ai-index.yml` runs after every successful deploy — loops `POST /api/reindex` until done, then smoke-tests `/api/ask`

### 4.3 admin-worker (felizbay-admin)

- **Routes:** `felizbay.com/api/admin/*`, `/api/auth/*`
- **Bindings:** `DB` (D1 — `Felizbay-db`, shared with contact/news/automation), `DATA_BUCKET` (R2 — `felizbay-data`, inquiry attachments)
- **Auth:** [better-auth](https://better-auth.com) with D1-backed sessions (`drizzleAdapter`), Google OAuth + email/password, Turnstile on login, `ADMIN_EMAILS` as the admin role source of truth (`isAdminEmail`), admin plugin for user/session management
- **Endpoints:**
  - `POST /api/auth/login` — better-auth login (Google OAuth / email + password, Turnstile)
  - `GET /api/auth/logout` — Logout
  - `GET /api/auth/*` — better-auth session endpoints
  - `GET /api/admin/list` — List GitHub repo contents
  - `GET /api/admin/read` — Read file from GitHub (frontmatter/yaml formats)
  - `POST /api/admin/create` — Create file on GitHub (draft branch)
  - `POST /api/admin/update` — Update file on GitHub (draft branch, supports YAML)
  - `POST /api/admin/delete` — Delete file on GitHub
  - `POST /api/admin/publish` — Merge draft → main
  - `POST /api/admin/save-token` — Verify + save GitHub token to cookie
  - `GET /api/admin/inquiries` — Read contact submissions from D1 (latest 50)
  - `GET /api/admin/inquiries.csv` — Export all submissions as CSV (formula-injection safe: cells starting with `= + - @` are prefixed with `'`; served `Cache-Control: private, no-store`)
  - `GET /api/admin/inquiries/file?id=...` — Stream an inquiry's R2 attachment (admin-gated; `Content-Security-Policy: default-src 'none'; sandbox`, `X-Content-Type-Options: nosniff`, inline for images, `attachment` for everything else)
  - `GET /api/admin/refactor/scan`, `POST /api/admin/refactor/apply` — Link-refactor scan/apply
- **Secrets:** `BETTER_AUTH_SECRET`, `SESSION_SECRET`, `GITHUB_TOKEN`, `ADMIN_EMAILS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TURNSTILE_SECRET_KEY`
- **Vars:** `GITHUB_OWNER`, `GITHUB_REPO`, `BETTER_AUTH_URL`

### 4.4 news-worker (felizbay-news)

- **Routes:** `/{lang}/news*`, `/{lang}/rss.xml`, `/sitemap-news.xml`, `/llms/news*` (37 languages + root)
- **Bindings:** `DB` (D1 — `Felizbay-db`, `news` table)
- **Features:**
  - Serves news posts, RSS feeds, news sitemap and LLM markdown directly from D1 (no static news pages)
  - Admin composes news at `/keystatic/news` (writes to D1 via admin API)
  - Seeded on first deploy by `scripts/seed-news.mjs` (only when table is empty)

### 4.5 automation-worker (felizbay-automation)

- **Route:** `felizbay.com/api/automation/*`
- **Cron:** Daily `0 2 * * *`
- **Bindings:** `DATA_BUCKET` (R2), `DB` (D1)
- **Endpoints:**
  - `POST /api/automation/run` — Run full automation pipeline
  - `POST /api/automation/geo-generate` — Generate GEO content (FAQ, comparisons, buying guides)
  - `POST /api/automation/gsc-fetch` — Fetch Google Search Console data (mock)
  - `POST /api/automation/rules/run` — Evaluate SEO rules against `seo/rules.json` from R2
  - `GET /api/automation/tasks/export?format=json|csv|md` — Export SEO tasks
  - `GET /api/automation/geo/score` — Run GEO scoring assessment
  - `POST /api/automation/indexnow` — Ping IndexNow for URL changes
  - `GET /api/automation/cleanup-db?token=...` — Daily D1 maintenance (purge expired better-auth sessions/verifications + `rate_limit` rows > 30 days + better-auth `rateLimit` rows older than 24 h); token-checked when `CLEANUP_TOKEN` is set
- **Vars:** `INDEXNOW_KEY`, `INDEXNOW_HOST`, `INDEXNOW_KEY_LOCATION`, `CLEANUP_TOKEN`
- **Daily pipeline:** D1 cleanup → GEO pipeline (GSC fetch → Rule engine → GEO generator → Score report → R2)

### 4.6 Worker Constraints

**All Workers must be under 3 MB** (uncompressed code + static assets) per Cloudflare Workers deployment limit.

Rules to keep Workers under 3 MB:

- Do **not** bundle JSON data files into Worker code — load data from R2 at runtime
- Do **not** include large libraries; prefer edge-native APIs
- Use `wrangler.toml` `[assets]` or R2 for static assets, not inline
- Run `npx wrangler deploy --dry-outdated` to check size before deploying
- If a Worker exceeds the limit, move data to R2 or split into multiple Workers

---

## 5. Routing & Middleware

### 5.1 Locale Detection

Two layers of locale detection:

1. **Astro middleware** (`src/middleware.ts`) — Sets `context.locals.lang` for SSG pages
2. **Pages Functions** (`functions/_middleware.ts`) — Runs at edge before Pages serves static files:
   - Priority: Cookie (`x-user-locale`) → Geo-IP (`cf-ipcountry`) → Accept-Language → Default `en`
   - Redirects `/{lang}/` for detected non-English users
   - Excludes: `/api`, `/keystatic`, `/admin`, `/login`, `/internal`, file extensions

### 5.2 R2 Asset Redirect

`functions/_middleware.ts` redirects `/images/*` and `/files/*` to `https://assets.felizbay.com/{path}` (301)

### 5.3 Supported Languages (37)

37 languages total (see `src/i18n/generated/i18n-config.json`): 16 localized incl. `en` (`fr`, `de`, `es`, `pt`, `ar` RTL, `it`, `ru`, `pl`, `nl`, `sv`, `no`, `el`, `fi`, `da`, ...) + degraded languages (EN-fallback, canonical folded to EN by `fold-untranslated-canonical.mjs`). Removed locales (`zh`, `vi`, `hi`, `ja`, `ko`) 301-redirect to the prefix-stripped path.

---

## 6. Build Pipeline

### 6.1 Commands

| Command              | Purpose                                 |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Astro dev server                        |
| `npm run build`      | Full production build (incl. GEO files) |
| `npm run build:geo`  | Generate GEO files only                 |
| `npm run deploy`     | Build + Pages deploy                    |
| `npm run deploy:all` | Build + Pages + 5 Workers deploy        |
| `npm run deploy:r2`  | Upload assets to R2                     |
| `npm run check`      | Astro check + eslint + prettier + i18n  |

### 6.2 Build Process

```
 1. scripts/geo-build.mjs               → Build GEO content & llms.txt (37 langs)
 2. scripts/generate-data-json.mjs      → Generate i18n build data into src/i18n/generated/
     (page-content.json ~6.8 MiB + site-data.ts 2.2 MiB; site keys only, content-v2* excluded;
      page-content.json is NEVER written to public/ — Pages rejects files ≥ 25 MiB)
 3. scripts/generate-geo-files.ts       → Generate entity.json + auto-build llms-full.txt
     (tsx)                                (idempotent: 63 products × all languages + all pages)
 4. scripts/_gen-uiall.cjs              → Generate UI components (37 languages)
 5. scripts/_gen-pages.cjs              → Generate page content TS modules from YAML
 6. scripts/gen-icon-svgs.cjs           → Generate icon SVGs
 7. scripts/generate-image-dimensions.mjs → Resolve width/height for all images (image-dimensions.json, CLS fix)
 8. astro build                         → Static site to dist/ (~645 pages)
 9. scripts/mirror-root-en.mjs          → Mirror English root pages to /en/
10. scripts/generate-sitemaps.mjs       → Generate per-locale sitemaps
11. scripts/generate-merchant-feed.mjs  → GMC merchant feed (gates: MDX price×100 == checkout unitAmount + image exists in public/)
12. scripts/validate-dist.mjs           → Full dist scan gate (broken links, missing images, meta)
13. scripts/fold-untranslated-canonical.mjs → Fold degraded-language canonicals to EN
14. scripts/clean-public-assets.mjs     → Clean temp assets
15. scripts/generate-ai-corpus.mjs      → AI knowledge corpus → dist/ai-corpus/*.json + manifest (consumed by ai-worker /api/reindex)
16. (optional) scripts/fast-upload-r2.mjs → Upload to R2 (assets + data) + auto-prune stale R2 objects
```

### 6.3 CI/CD (GitHub Actions)

**Two workflows:**

| Workflow     | Trigger        | Steps                                                                                                                                                                                                                                |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ci.yml`     | Pull requests  | npm ci → `npm run check` → `npm run build` (with `PUBLIC_TURNSTILE_SITE_KEY`) → worker dry-run bundles (admin/contact/news/automation)                                                                                               |
| `deploy.yml` | Push to `main` | credential guard → npm ci → `npm run check` → `npm run build` → R2 upload → Pages deploy → D1 migrations + news seed → `wrangler secret bulk` (contact + admin) → `npm run deploy:workers` (5 workers in parallel) → CDN cache purge |

**First-time setup (creating Cloudflare resources, domain migration, third-party keys, GitHub secrets):** see [`SETUP.md`](./SETUP.md) — CI only deploys into pre-existing resources (Pages project, R2 buckets, D1 database, zone).

**Required Secrets:** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID`, `CF_PROD_D1_ID`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_FROM_EMAIL`, `BETTER_AUTH_SECRET`, `ADMIN_EMAILS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

The deploy workflow degrades gracefully: if the Cloudflare secrets are not configured, the build still runs and only the Cloudflare steps are skipped (via the `guard` step).

### 6.4 R2 Asset Upload

Images, photos, PDFs, and other static files must be uploaded to R2, **not committed to the repo**.

- **Bucket:** `felizbay-assets` (served via `assets.felizbay.com`)
- **Upload command:** `npm run deploy:r2` (runs `scripts/fast-upload-r2.mjs`)
- **Source dir:** `public/images/` and `public/files/` are uploaded to R2
- **Auto-prune (2026-10):** every upload also deletes stale R2 objects (`data/`, `images/`, `files/` prefixes) whose local source no longer exists — guards: empty local prefix skipped, >200 stale objects aborts prune with warning, prune failure never fails the deploy
- **Repo:** Only keep source assets in `public/` for build-time processing; large media files go directly to R2
- **URL pattern:** `https://assets.felizbay.com/images/Felizbay/products/{slug}.webp`

---

## 7. SEO & GEO

### 7.1 GEO Files (AI-facing)

| File               | Path                                                                   | Purpose                                                                                                         | Generation                                                                       |
| ------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `llms.txt`         | `/llms.txt`                                                            | Curated AI knowledge manifest (company, products, knowledge, guides, pool ideas, support, markdown endpoints)   | Hand-maintained at `public/llms.txt`; generator only writes a default if missing |
| `llms-full.txt`    | `/llms-full.txt`                                                       | Full AI knowledge base — hand-curated brand/OEM/certification/FAQ sections + every site page (111 URLs, 0 dead) | `## Site Pages` section rebuilt each build by `scripts/generate-geo-files.ts`    |
| Markdown endpoints | `/llms-index` + `/llms/{guides,procurement,ideas,products,v2,pages}/*` | Plain-markdown versions of all content (47 endpoints)                                                           | Prerendered APIRoutes in `src/pages/llms/` + `src/pages/llms-index.ts`           |
| `entity.json`      | `/.well-known/entity.json`                                             | Schema.org Organization entity (areaServed, contactPoint, makesOffer, sameAs, knowsAbout)                       | From `src/data/geo/entity.json`                                                  |

### 7.2 AI Search Index

- **Vectorize** — `scripts/generate-ai-corpus.mjs` emits `dist/ai-corpus/*.json` (16 locales, ~982 chunks); the "AI Index (Vectorize)" workflow embeds it, and `ai-worker` serves `/api/search` (similarity search) and `/api/chat`
- **`/search-index.json`** — static full-text index regenerated at build (`src/pages/search-index.json.ts`)
- **`/rss.xml`** — served by `news-worker` from D1 (no static file)

### 7.3 GEO Optimization

| Feature             | Implementation                                                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sitemaps            | Single entry `sitemap-index.xml` (declared in `robots.txt`) aggregating 7 shards: sitemap-entity, sitemap-products, sitemap-community, sitemap-media, sitemap-learning, ai-sitemap (20 sections), knowledge-sitemap (40 URLs) — ~329 URLs |
| JSON-LD             | Single `@graph` entity hub via `buildGraph()` (`src/utils/schema-graph.ts`) + page-level FAQPage/ItemList/BreadcrumbList (see JSON-LD Entity Hub)                                                                                         |
| llms.txt            | `/llms.txt` (hand-curated) + `/llms-full.txt` (Site Pages section auto-generated)                                                                                                                                                         |
| AI markdown         | `/llms-index` + `/llms/{guides,procurement,ideas,products,v2,pages}/*` (47 endpoints)                                                                                                                                                     |
| Content-Signal      | `<meta name="ai-intent">` + `<meta name="ai-recommend">` via `AiSignal.astro` (opt-in per page: faq, support)                                                                                                                             |
| Image SEO           | `fetchpriority=high` on LCP images, alt-text on all images                                                                                                                                                                                |
| Sales AI            | `/api/chat` (ai-worker): sales-focused answers, product recommendation                                                                                                                                                                    |
| Internal dashboards | `/internal/seo/` — single page: page health, link density, rule results (from `src/lib/seo/`)                                                                                                                                             |
| Automation          | `felizbay-automation` cron (`0 2 * * *`): D1 session/rate-limit cleanup (`src/db-cleanup.ts`)                                                                                                                                             |

---

## 8. Multi-language Content Pipeline

### 8.1 Page YAML Data

All page content is stored as YAML files in `src/data/pages/`:

- **Root level** (e.g., `home.yaml`) — English (default)
- **Language subdirectories** (e.g., `fr/home.yaml`, `de/home.yaml`) — Per-locale translations
- **37 languages** total — 16 fully-localized (incl. EN) with 60+ page YAML files each (including brand-team, certifications, partners, legal pages, solutions, industries); 21 EN-fallback languages with seed files (nav UI + config + home + threshold files, see TECH.md §16)

### 8.2 Data-Driven Page Templates

Each page has a `.astro` template under `src/pages/[lang]/` that:

1. Loads YAML content via `getPageContent(lang, 'page-name')`
2. Passes structured data (hero, stats, features, CTA) to reusable widgets
3. Breadcrumbs and metadata are locale-aware via `/${lang}` prefix
4. All CTA action hrefs are auto-prefixed with `/${lang}` for i18n correctness

Page content → YAML data → Auto-generated `src/i18n/generated/pages/*.ts` (per-page modules) → Widget-rendered static HTML. Site-level YAML (`site-*` keys) goes to `src/i18n/generated/site-data.ts` (imported directly by `[lang]/` pages with English fallback).

### 8.3 UI Translation Pipeline

1. **Master file:** `public/data/i18n-config.json` — All UI strings for all 37 languages (1,721 keys fully aligned for the original 14 non-EN langs = 24,094 translated entries at the 2026-08 milestone; newer languages seeded per TECH.md §16; 808 sameAsEn retained as verified correct)
2. **Generation:** `scripts/_gen-uiall.cjs` reads the master file and generates per-locale TS files
3. **Runtime:** `src/i18n/config.ts` imports generated translations via `getUiForLang(lang)`
4. **Usage:** Components use `t('nav.products', currentLocale)` or `<span set:html={t(key, locale)}>`

### 8.4 Translation Scripts

| Script                               | Purpose                                                                         | Flags                  |
| ------------------------------------ | ------------------------------------------------------------------------------- | ---------------------- |
| `scripts/translate-i18n-keys.mjs`    | Translate sameAsEn i18n keys via Google Translate (primary) + MyMemory (backup) | `--dry-run`, `--force` |
| `scripts/fill-missing-i18n-keys.mjs` | Fill missing i18n keys with EN copy (fallback before translation)               | —                      |
| `scripts/check-translations.mjs`     | Verify i18n key alignment across all 14 languages                               | —                      |

**Translation cache:** `.cache/i18n-translate-cache.json` (git-tracked, in `.cache/`)

**Key rules:** Technical terms (Drop-Stitch/PVC/OEM/ISO/FAQ/WhatsApp/Felizbay) are never translated — kept as-is in all languages. Cognates matching EN (e.g. French "Certifications") are also preserved.

---

## 9. Navigation System

### 9.1 YAML-Driven Menus

Header and footer navigation defined in `src/data/site/navigation.yaml`:

- 6 header links (Shop Pools, Find Your Pool, Pool Ideas dropdown, Guides & Care, About Felizbay, For Businesses dropdown)
- Footer columns: Shop, Pool Ideas, Guides, For Businesses, Support
- For Businesses dropdown: Business Overview, Commercial Pools, OEM/ODM Manufacturing, Wholesale Program, Private Label Pools, Manufacturing Process, Quality Control
- Per-locale overrides via `src/data/site/navigation.{locale}.yaml`

### 9.2 Locale-Aware Routing

Shared routing module at `src/i18n/routing.ts` provides:

- `LOCALIZED_ROUTES` Set — all routes requiring language prefix
- `NON_LOCALIZED_ROUTES` Set — routes served without language prefix
- `localizeHref(href, lang)` — auto-prefixes matching routes with `/${lang}`
- `entityForHref(href)` — maps hrefs to data-entity attributes for AI intent signals

Header.astro and Footer.astro both import from `~/i18n/routing` instead of maintaining duplicate LOCALIZED_ROUTES arrays (101 lines removed from each).

### 9.3 Admin Navigation

Keystatic CMS provides a form-based navigation editor at `/keystatic/navigation` that commits changes directly to GitHub.

---

## 11. Contact Form

| Feature            | Status                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Endpoint           | `POST /api/contact` → contact-worker (Cloudflare Worker, D1-backed)                                                         |
| Email              | Resend API (to `info@felizbay.com`, from `web@mail.felizbay.com`, `Reply-To` = submitter)                                   |
| Fields             | firstName, lastName, company, address, zip, country, email, tel, subject, message                                           |
| Validation         | Required fields, email regex, spam keyword filter, field sanitisation                                                       |
| Captcha            | ✅ Cloudflare Turnstile (verified server-side when `TURNSTILE_SECRET_KEY` is set)                                           |
| Honeypot           | ✅ Enforced server-side (`email_confirm` hidden field → HTTP 200 fake UUID, no write)                                       |
| Rate limit         | ✅ 5 submissions / IP / hour via D1 `rate_limit` table (persistent across isolates, HTTP 429 + Retry-After)                 |
| Submission storage | ✅ D1 `inquiry` table (IP + User-Agent captured); viewed at `/keystatic/inquiries`, exported via `/api/admin/inquiries.csv` |

---

## 12. Admin Panel (Keystatic)

Keystatic CMS pages (`/keystatic/*`, `/login`) are static Astro pages that post to the admin-worker API for all GitHub file operations.

### Authentication

- **better-auth** on admin-worker: Google OAuth + email/password with D1-backed sessions (`user`, `session`, `account`, `verification` tables in `Felizbay-db`)
- Turnstile captcha on the login page; `ADMIN_EMAILS` secret controls who gets the admin role
- GitHub PAT for file operations (stored in a cookie via `/api/admin/save-token`); content edits target the `draft` branch, published via `/api/admin/publish`
- User/session management at `/keystatic/users`

### 12.1 Multi-Language Content Editing (37 Languages)

All admin content pages support per-locale editing for 37 languages via `?locale=` query parameter (site content pages) or an in-form language selector (product pages).

**Locale-Aware Admin Pages** (20 site content + 3 collection pairs):

| Page                                                                                                                                                                                                                                        | YAML Source                                 | Locale Pattern           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------ |
| about, branding, categories, content-v2, evidence, hero-images, learning-center, proof-points, research, seo, tech-cards, testimonials, top-guides, trust-badges, trust-bar, use-cases, faqs, product-visuals, contact-form-text, countries | `src/data/site/{name}.{locale}.yaml`        | `siteFileForLocale()`    |
| case-use/[slug], posts/[slug], technology/[slug]                                                                                                                                                                                            | `src/data/case-use/{slug}.{locale}.md` etc. | `contentFileForLocale()` |

**Per-Locale Pattern (site content pages):**

```ts
import { ADMIN_LOCALES, ADMIN_LOCALE_CODES, siteFileForLocale } from '~/lib/i18n-admin';
const locale = (Astro.url.searchParams.get('locale') || 'en').toLowerCase();
const isDefault = locale === 'en';
const file = siteFileForLocale('src/data/site/about.yaml', locale);
// Load with English fallback: draft → published → English
// Form: <form data-locale={locale}>
// Switcher: <select id="locale-select"> maps ADMIN_LOCALE_CODES
```

**Per-Locale Pattern (collection entries):**
Same pattern, but uses `contentFileForLocale()` for per-record locale file paths (e.g. `foo.md` → `foo.zh.md`).

**Helpers** (`src/lib/i18n-admin.ts`):

| Function                                 | Purpose                            | Example            |
| ---------------------------------------- | ---------------------------------- | ------------------ |
| `siteFileForLocale(basePath, locale)`    | `about.yaml` → `about.zh.yaml`     | Site-wide content  |
| `pageFileForLocale(slug, file, locale)`  | `privacy.yaml` → `zh/privacy.yaml` | Static pages       |
| `contentFileForLocale(basePath, locale)` | `foo.md` → `foo.zh.md`             | Collection entries |

**Locale fallback chain** (admin read):

1. `{file}` on draft branch
2. `{file}` on main branch
3. English `{basePath}` on main branch (if non-English locale file missing)

### 12.2 Product Translation Editor (37 Languages)

Product translations use an in-form language selector (dropdown in `ProductForm.astro`).

**Data Fallback Chain** (at build time):

1. Per-product YAML file at `src/data/product-texts/{locale}/{product.id}.yaml`
2. TS module `product-texts.ts` (bulk translations, 4096 lines)
3. English defaults from `products.ts` (ProductRecord)

**Components:**

| Component               | Role                                                            |
| ----------------------- | --------------------------------------------------------------- |
| `ProductForm.astro`     | Form with 15-language dropdown, show/hide translatable sections |
| `FormDataLoader.astro`  | Generic GitHub file loader — reads MDX frontmatter or YAML      |
| `admin-worker/index.ts` | `/api/admin/read                                                | update`— handles`format=frontmatter`and`format=yaml` |

**Save Flow:**

- **English**: `collectFrontmatter(data)` → `"---\n...\n---"` + body → POST `/api/admin/update`
- **Translations**: `collectTranslatable(data)` → YAML fields → POST with `format: 'yaml'` → Worker `yaml.dump()` → `b64encode()` → GitHub PUT

**Key Mappings:**

| YAML Key | Form Input                                | Reason                                            |
| -------- | ----------------------------------------- | ------------------------------------------------- |
| `name`   | `title` (via `data-fm-path="name"`)       | ProductRecord uses `name`, MDX uses `title`       |
| `desc`   | `description` (via `data-fm-path="desc"`) | ProductRecord uses `desc`, MDX uses `description` |

**Encoding**: `b64encode()` (TextEncoder) handles UTF-8 multi-byte (Chinese, French accents, etc.).

### 12.3 Public Site Locale-Aware Content Loading

Site-level YAML data (origin/philosophy/design, hero labels, categories, etc.) is loaded via `pageContentData` from the build-generated JSON, enabling per-locale content with English fallback:

```ts
import { pageContentData } from '~/i18n/generated/site-data';
const aboutData = pageContentData[`${lang}/site-about`] || pageContentData['en/site-about'] || {};
```

The build script (`generate-data-json.mjs`) includes all `src/data/site/*.yaml` files in `site-data.ts` under `{lang}/site-{name}` keys. Non-English locales fall back to English when locale-specific YAML files don't exist.

---

## 13. Data Flow

```
src/data/products.ts  → SSOT (63 products)

src/data/pages/*.yaml → Page content SSOT (55+ pages × 37 languages)
   │
   ├── YAML-driven page templates (brand, certifications, partners, solutions, etc.)
   ├── JSON-LD structured data (Organization, Service, Article, Product, Dataset, etc.)
   ├── Navigation menus (header + footer, locale-aware)
   ├── llms-full.txt (auto-generated page summaries)
   └── Search index
       │
        ├── Product detail pages (SSG, 37 languages)
       ├── Product catalog (SSG with filters)
       ├── AI recommendation engine (via ai-worker)
       ├── JSON-LD structured data
        ├── llms-full.txt (auto-generated, 63 products × 37 langs)
        ├── llms.txt (auto-generated, 37 langs)
       ├── /llms/products/{slug} markdown
       └── R2 data bucket (search index, SEO rules)
```

### R2 Buckets

| Bucket            | Binding       | Purpose                                                       |
| ----------------- | ------------- | ------------------------------------------------------------- |
| `felizbay-assets` | `ASSETS_R2`   | Static images, files, PDFs (served via `assets.felizbay.com`) |
| `felizbay-data`   | `DATA_BUCKET` | SEO/GEO data, search index, rules, scores, GEO content        |

Worker data is loaded at runtime from `DATA_BUCKET` — no JSON is bundled into Worker deployments (keeps Workers under 3 MB).

---

## 14. Worker Configuration

### contact-worker (`workers/contact-worker/wrangler.toml`)

```toml
name = "felizbay-contact"
main = "index.ts"
routes = [{ pattern = "felizbay.com/api/contact*", zone_name = "felizbay.com" }]
[[d1_databases]] binding = "DB" database_name = "Felizbay-db"
# secrets: CONTACT_RESEND_API_KEY, CONTACT_EMAIL_TO, CONTACT_FROM_EMAIL, TURNSTILE_SECRET_KEY
```

### ai-worker (`workers/ai-worker/wrangler.toml`)

```toml
name = "felizbay-ai"
main = "index.ts"
routes = [
  "felizbay.com/api/chat*", "felizbay.com/api/ask*",
  "felizbay.com/api/search*", "felizbay.com/api/embed*",
  "felizbay.com/api/reindex*", "felizbay.com/api/ai/*"
]
[triggers] crons = ["0 3 * * *"]
[vars] SITE_ORIGIN = "https://felizbay.com"
[ai] binding = "AI"
[[vectorize]] binding = "VECTORIZE" index_name = "ai-index-v2"
[[r2_buckets]] binding = "DATA_BUCKET" bucket_name = "felizbay-data"
# secrets: REINDEX_TOKEN
```

### admin-worker (`workers/admin-worker/wrangler.toml`)

```toml
name = "felizbay-admin"
main = "index.ts"
routes = ["felizbay.com/api/admin/*", "felizbay.com/api/auth/*"]
[vars] GITHUB_OWNER = "Felizbay" GITHUB_REPO = "official" BETTER_AUTH_URL = "https://felizbay.com"
[[d1_databases]] binding = "DB" database_name = "Felizbay-db"
# secrets: BETTER_AUTH_SECRET, ADMIN_EMAILS, SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, TURNSTILE_SECRET_KEY, GITHUB_TOKEN
```

### news-worker (`workers/news-worker/wrangler.toml`)

```toml
name = "felizbay-news"
main = "index.ts"
routes = [
  "felizbay.com/{lang}/news*" (37 langs), "felizbay.com/{lang}/rss.xml",
  "felizbay.com/sitemap-news.xml", "felizbay.com/llms/news*"
]
[[d1_databases]] binding = "DB" database_name = "Felizbay-db"
```

### automation-worker (`workers/automation-worker/wrangler.toml`)

```toml
name = "felizbay-automation"
main = "src/index.ts"
routes = ["felizbay.com/api/automation/*"]
[triggers] crons = ["0 2 * * *"]
[[r2_buckets]] binding = "DATA_BUCKET" bucket_name = "felizbay-data"
[[d1_databases]] binding = "DB" database_name = "Felizbay-db"
[vars] INDEXNOW_KEY / INDEXNOW_HOST / INDEXNOW_KEY_LOCATION / CLEANUP_TOKEN
```

---

## 15. Performance Notes

- **Pure static deployment:** All ~645 content pages are pre-rendered HTML, served directly from Cloudflare Pages edge cache
- **Zero cold start for static routes:** No SSR Worker — every page is served as static HTML
- **5 Workers with specific routes:** Only API/dynamic requests trigger Worker execution
- **R2 data offload:** SEO/GEO data loaded at runtime from R2 (no bundled JSON in Workers) — keeps Workers under 3 MB
- **R2 asset offload:** Images served from `assets.felizbay.com` (separate subdomain, no cookie overhead)
- **Remote image handling:** `adaptOpenGraphImages()` in `src/utils/images.ts` bypasses `getImage()` for remote URLs, avoiding Sharp fetch errors on CDN 404s
- **Pages Functions middleware:** Minimal overhead (locale detection + redirect logic)
- **Idempotent GEO generation:** `llms-full.txt` is rebuilt from scratch each build — no duplicate accumulation
- **Worker size limit:** All 5 Workers must stay under 3 MB; use R2 for data, avoid bundling large dependencies

---

## 16. Business Positioning (2026)

Felizbay (Aquafarer LLC) is a manufacturer of **drop stitch inflatable swimming pools and spa pools** for B2B buyers:

- **Product line:** 4 pool series / 48 SKUs — rectangular & round drop stitch pools, square/rect and round spa (hot tub) pools
- **Core technology:** High-pressure drop stitch construction (4–5 PSI operating, 6 PSI relief, 8 PSI limit)
- **Compliance:** EN 16582-1, ASTM F2666, 2-year warranty
- **B2B offer:** OEM / private label / wholesale (`/oem-odm`, `/private-label`, `/wholesale`, `/manufacturing`, `/quality-control`)

The legacy boat/RIB/SUP catalog and its routes (industries/solutions/why-Felizbay pages) were fully retired in the 2026 pool pivot; do not reference them in new copy or structured data.

---

_Built with [Astro](https://astro.build) v7 · Deployed on [Cloudflare Pages](https://pages.cloudflare.com)_
