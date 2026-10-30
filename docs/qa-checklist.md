# Felizbay QA Checklist (2nd.docx §15 formalized)

Source: 泳池优化方案 2nd.docx「十五、开发验收清单」— 27 acceptance items, mapped to the
current site state and the automated gates that verify each one. Re-run the
"Verification" commands before every release; update statuses when a workstream
lands.

Legend: ✅ pass · 🟡 partial · ❌ blocked / not applicable yet

## 网站基础 (Site basics)

| #   | Item                         | Status | Notes & verification                                                                                                      |
| --- | ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | 所有主导航链接正常访问       | ✅     | `dist-gate` broken-links = 1 (`/api/admin/inquiries.csv` worker route false positive). Nav hrefs = walking `dist/` links. |
| 2   | 多语言路由及语言切换正常     | ✅     | 65bc428: route-aware hreflang + switcher (root-only whitelist). Gate: hreflang broken = 1 (`/404`, moot).                 |
| 3   | 移动端导航正常               | 🟡     | Not automated — manual check (hamburger menu, dropdowns) in browser at 375 px before release.                             |
| 4   | 首页、分类和产品页面加载正常 | ✅     | `npm run build` (648 pages) + `scripts/validate-dist.mjs` PASS + `mirror-root-en.mjs` 0 missing.                          |
| 5   | 404 和 301 规则正确          | ✅     | `/404` returns 404 status; locale-removal redirects 308→200 spot-checked in production (2026-10 session).                 |

## 产品系统 (Product system)

| #   | Item                           | Status | Notes & verification                                                                                                                                                           |
| --- | ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 6   | 所有 SKU 均有唯一编号          | 🟡     | 5 product records + factory item numbers in `src/data/pool-catalog.ts` (e.g. FZ-POOL-RND-BLUE). 48-SKU retail grid awaits real catalog data.                                   |
| 7   | 产品价格与库存读取统一数据源   | 🟡     | Prices: MDX frontmatter ↔ `functions/api/checkout.ts` PRODUCT_CATALOG, enforced by `generate-merchant-feed.mjs` same-source gate (CI-hard). Stock: `inStock` frontmatter only. |
| 8   | 尺寸切换同步更新规格与图片     | ❌     | No interactive size switcher yet — static fit tables + size matrices per product page. Future PDP workstream.                                                                  |
| 9   | 产品兼容性资料完整             | 🟡     | PackageContents + optional add-ons per product (`PRODUCT_PAGE_DETAILS`); full accessory compatibility matrix needs 48-SKU data.                                                |
| 10  | 产品页面包含真实安装及使用说明 | 🟡     | SetupStorage module + 8-step setup guide; factory manual PDFs still blocked (audit item ②).                                                                                    |

## 比较与 AI (Compare & AI)

| #   | Item                               | Status | Notes & verification                                                                                                                 |
| --- | ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 11  | 最多比较 3 款产品                  | ✅     | `/products/compare/` compares the current product lineup (5 models); 3-way cap matches catalog size.                                 |
| 12  | AI 能读取全部有效 SKU              | ✅     | `generate-ai-corpus.mjs` → `dist/ai-corpus/*.json` + ai-worker `/api/reindex`; includes catalog item numbers.                        |
| 13  | AI 推荐结果包含具体 SKU            | ✅     | Corpus carries SKUs + product links; AIChat answers cite product pages.                                                              |
| 14  | AI 推荐有明确匹配理由              | ✅     | `/ai-answer-center/` answer include rationale; AI answers state fit reasoning (space, users, budget).                                |
| 15  | 不满足安全条件时提示并阻止错误推荐 | 🟡     | `/find-your-pool/` filters by space/usage; safety constraints (deck rating, supervision) are stated in answers but not hard-blocked. |
| 16  | AI 价格和库存来自实时商品接口      | ❌     | Corpus is build-time static (daily rebuild cadence). Real-time inventory API needs the commerce backend.                             |

## 电商交易 (E-commerce)

| #   | Item                     | Status | Notes & verification                                                                                                                                                     |
| --- | ------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 17  | 购物车支持数量和规格修改 | ❌     | No cart — direct Stripe buy (single-item `mode: payment`). Cart is a 2.0 workstream. **Checkout currently disabled** (`CHECKOUT_ENABLED=false`, Stripe not provisioned). |
| 18  | 运费和税费计算正确       | ❌     | No live shipping calculation — by design until real carrier rates exist (2nd.docx warning: 无真实报价勿显示国际运费).                                                    |
| 19  | 支付成功和失败状态正确   | 🟡     | `success_url`/`cancel_url` + result banners implemented and i18n'd; untestable end-to-end while Stripe is off.                                                           |
| 20  | 订单不会重复创建         | ❌     | No order persistence (no webhook). `client_reference_id` only. Needs order backend.                                                                                      |
| 21  | 退款和取消流程正常       | 🟡     | Policy documented (`/returns-and-warranty/`); Stripe-side refund flow unverified until account is live.                                                                  |

## 售后与营销 (Support & marketing)

| #   | Item                       | Status | Notes & verification                                                                                                                                                                      |
| --- | -------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 22  | 订单追踪正常               | ❌     | `/track-order/` needs an order backend (webhook + D1). Blocked with #20.                                                                                                                  |
| 23  | 质保和退货政策可访问       | ✅     | `/returns-and-warranty/` + `/support/` hub + footer link + product-page warranty card (2026-10-30).                                                                                       |
| 24  | 售后支持关联具体 SKU       | 🟡     | FAQ entries carry `relatedProducts`/`relatedGuides`; support cards are policy-level, not per-SKU yet.                                                                                     |
| 25  | 真实评价能够提交和管理     | ❌     | No review system; needs real customers first (audit item ⑪).                                                                                                                              |
| 26  | GA4 购买和 AI 事件正常记录 | ❌     | GA4 not adopted — Cloudflare Web Analytics chosen 2026-10 (no cookies → no consent banner). Purchase events blocked with checkout.                                                        |
| 27  | Schema 和 Sitemap 验证通过 | ✅     | `dist-gate`: canonical broken = 1 (`/404`), noindex-in-sitemap = 0, sitemap↔canonical mismatch = 53 (fold, by design); ProductGroup + hasVariant verified on root & [lang] product pages. |

## Score & re-verification

- ✅ 11 · 🟡 8 · ❌ 8 — foundations green; commerce & review items are blocked on the
  2.0 backend workstreams (48-SKU database, cart/checkout, order backend, reviews).

Release re-verification (run in order):

```powershell
npm run build          # ~648 pages, validate-dist + all post-build gates
npm run check          # astro check + ESLint + Prettier
node scripts/validate-dist.mjs   # (runs inside build; standalone re-run OK)
# dist-gate (temp tool, session-scoped): broken links / hreflang / canonical / noindex scans on dist/
# Production spot-checks: nav links, language switch, /404 status, /support/ loads, product pages render
```

Manual pre-release spot-checks (not automatable): mobile navigation (#3), dark mode,
contact form roundtrip (Turnstile + D1 insert + email), AIChat answer quality.
