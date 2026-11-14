# Felizbay 网站技术架构文档

> 最后更新: 2026-10-21 (P6 WebP 图片迁移: 15 张 >100KB 产品图转 WebP 1600px q82, 18.5MB→0.85MB; 蜜罐误伤修复: Contact.astro 页面 JS 提交前删除 email_confirm 字段, 事故复盘见 docs/technical-audit-2026-10.md §2.1; R2 自动 prune: fast-upload-r2.mjs 每次 deploy 自动清理本地已删除的 R2 对象; www→apex 301: Cloudflare Redirect Rule 单跳路径保留; 完整审计记录见 docs/technical-audit-2026-10.md)
> 项目路径: `D:\Github\Felizbay`
> 在线网址: https://felizbay.com (Cloudflare Pages + 5 Workers)
> 构建命令: `npm run build` → 输出到 `dist/` 目录
> 部署命令: `npx wrangler pages deploy dist/ --project-name felizbay`

---

## 目录

1. [技术栈](#1-技术栈)
2. [项目结构](#2-项目结构)
3. [构建流程](#3-构建流程)
4. [国际化 (i18n) 系统](#4-国际化-i18n-系统)
5. [产品页面系统](#5-产品页面系统)
6. [数据流与渲染管线](#6-数据流与渲染管线)
7. [Cloudflare Workers](#7-cloudflare-workers)
8. [Cloudflare Pages Functions](#8-cloudflare-pages-functions)
9. [R2 存储](#9-r2-存储)
10. [部署架构与限制](#10-部署架构与限制)
11. [常见错误及避免方法](#11-常见错误及避免方法)
12. [编辑指南与红线](#12-编辑指南与红线)
13. [附录: 关键文件引用](#13-附录-关键文件引用)
14. [后台管理系统架构](#14-后台管理系统架构)
15. [多语言批量编辑工具 (tools/)](#15-多语言批量编辑工具-tools)
16. [37 语言架构与上架流程](#16-37-语言架构与上架流程)
17. [图片处理 (WebP + 尺寸注册表)](#17-图片处理-webp--尺寸注册表)
18. [依赖安全 (2026-11)](#18-依赖安全-2026-11)
19. [GEO 第三轮审查落地 (2026-11-03)](#19-geo-第三轮审查落地-2026-11-03)

---

## 1. 技术栈

| 层       | 技术                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| 框架     | **Astro 7.4** (v7.4.4, Rust 编译器), `output: 'static'`, Vite 8 (Rolldown)                                     |
| 语言     | TypeScript (v6.0.3)                                                                                            |
| 样式     | Tailwind CSS v4.3 + `@tailwindcss/vite` 插件 (postcss.config.js 已移除)                                        |
| 包管理   | npm (package-lock.json, CI 使用 `npm ci`)                                                                      |
| Node     | >= 22.12.0                                                                                                     |
| 主机     | **Cloudflare Pages** (静态文件) + **Cloudflare Workers** (API)                                                 |
| 数据库   | **Cloudflare D1** (`Felizbay-db`: inquiry, news, rate_limit, advisor_event, better-auth 表)                    |
| 存储     | **Cloudflare R2** (felizbay-assets, felizbay-data)                                                             |
| CMS      | Keystatic (本地 CMS, 在 `/keystatic` 路由)                                                                     |
| 认证     | better-auth (Google OAuth + 邮箱密码, D1 会话, Turnstile)                                                      |
| 插件     | `@astrojs/sitemap`, `@astrojs/mdx`, `astro-icon`, `astro-seo`, `@astrojs/markdown-remark`, `astro-auto-import` |
| 产品数据 | `src/data/products.ts` (TypeScript 数组)                                                                       |
| 多语言   | 37 种语言, 自建 i18n 系统 (`src/i18n/`)                                                                        |

**注意**: 项目不使用 `@astrojs/cloudflare` 适配器, 而是构建为纯静态输出后部署到 Cloudflare Pages。Pages 自带的 Functions (`functions/_middleware.ts`) 处理语言重定向和 R2 资源跳转。

---

## 2. 项目结构

```
.
├── astro.config.ts          # Astro 配置 (output: 'static', 插件, alias)
├── package.json             # 脚本: dev/build/deploy/check
├── wrangler.toml            # 根 wrangler (仅声明 R2 bucket)
├── tsconfig.json
├── keystatic.config.ts      # Keystatic CMS 配置
├── src/
│   ├── config.yaml          # 主配置 (astrowind 主题)
│   ├── config.*.yaml        # 各语言覆盖配置 (zh, fr, de...)
│   ├── i18n/
│   │   ├── config.ts        # 语言列表, setLang() — 共享可变 _ui (不再直接使用)
│   │   ├── utils.ts         # getLangFromUrl, removeLang, localizePath
│   │   ├── page-content.ts  # getPageContent(lang, page) — 页面内容缓存
│   │   ├── data-registry.ts # 数据注册表 (产品/指南/内容)
│   │   └── generated/       # 构建期生成 (gitignored)
│   │       ├── ui-all.ts    # getUiForLang(lang) — 翻译入口
│   │       ├── ui/en.ts     # 英语翻译键值对 (自动生成)
│   │       ├── ui/{lang}.ts # 37 语言翻译 (39 个生成文件)
│   │       ├── pages/*.ts   # 每页一个模块 (~110 个, setPageContentData 注入)
│   │       ├── site-data.ts # site-* 键 (2.2 MiB, [lang]/ 页面直接 import)
│   │       ├── page-content.json # 全量载荷 (~6.8 MiB, 仅构建期用, 不进 public/)
│   │       └── i18n-config.json  # UI 文案 (同步一份到 public/data/)
│   ├── data/
│   │   ├── products.ts      # ProductRecord[] — 产品定义 (63 产品)
│   │   ├── product-business-data.ts  # 产品商业标签 (use_case, bestFor, ROI 数据)
│   │   ├── product-texts.ts # 产品多语言翻译文本
│   │   ├── content-v2.ts    # 内容 v2 记录 (含 business-guide 文章)
│   │   ├── knowledge-graph.ts # AI 知识图谱 (商业实体关系)
│   │   ├── world-map-data.ts   # 全球客户地图 (7 区域, 50+ 国家)
│   │   ├── factory-videos.ts   # 工厂视频数据 (8 阶段)
│   │   ├── faq.ts           # FAQ 数据
│   │   └── guides.ts        # 指南数据
│   ├── layouts/
│   │   ├── Layout.astro     # 主布局 (调用 setLang)
│   │   ├── PageLayout.astro # 页面布局
│   │   ├── ProductLayout.astro
│   │   └── ...
│   ├── pages/
│   │   ├── [lang]/          # 多语言路由 (37 语言, 降级语言 canonical 折叠, 全站 ~645 页面)
│   │   │   ├── index.astro       # 首页 (每种语言)
│   │   │   ├── products/
│   │   │   │   ├── index.astro   # 产品列表
│   │   │   │   └── [slug].astro  # 产品详情
│   │   │   ├── faq.astro         # FAQ 页
│   │   │   ├── search.astro      # 站内搜索
│   │   │   ├── disclaimer.astro / privacy.astro / terms.astro  # 法律页
│   │   │   ├── factory/
│   │   │   │   ├── index.astro       # 工厂总览
│   │   │   │   ├── capacity.astro    # 生产能力
│   │   │   │   ├── process.astro     # 生产流程
│   │   │   │   ├── quality-lab.astro # 质量实验室
│   │   │   │   ├── equipment.astro   # 设备与机械
│   │   │   │   └── oem-capability.astro # OEM/ODM 能力
│   │   │   └── ...
│   │   ├── products/        # 英语直连产品页面
│   │   │   ├── [slug].astro # 产品详情 (英语, 无语言前缀)
│   │   │   ├── index.astro
│   │   │   └── compare.astro
│   │   └── ...
│   ├── components/
│   │   ├── widgets/
│   │   │   ├── Header.astro # 导航栏 (使用 getUiForLang)
│   │   │   └── Footer.astro # 页脚 (使用 getUiForLang)
│   │   └── ...
│   ├── middleware.ts        # Astro 中间件 (设置 locals.lang)
│   ├── content.config.ts    # Astro Content Collections 定义
│   └── utils/
│       └── products.ts      # 产品工具函数
├── workers/                 # Cloudflare Workers (5 个)
│   ├── admin-worker/        # better-auth 认证 + GitHub CRUD + D1 查询
│   ├── ai-worker/           # AI 问答/嵌入/向量检索 + 知识库重建 (Vectorize ai-index-v2)
│   ├── automation-worker/   # 每日 cron: D1 清理 + IndexNow + GEO 流水线
│   ├── contact-worker/      # 联系表单 (D1 + Turnstile + Resend)
│   ├── news-worker/         # D1 驱动的新闻/RSS/新闻 sitemap
│   └── shared/              # 共享代码 (auth.ts, schema.ts, client.ts, news-render.ts, assert-admin.ts)
 ├── migrations/              # D1 迁移 0000–0005 (初始化, news, rate_limit, inquiry_ip, inquiry_routing, advisor_event)
├── functions/
│   └── _middleware.ts       # Cloudflare Pages Functions 中间件
├── scripts/                 # 构建/部署/工具脚本 (~60 个)
└── dist/                    # 构建输出 (静态文件)
```

---

## 3. 构建流程

`npm run build` 执行以下脚本:

```
node scripts/geo-build.mjs              # 1. 构建地理数据 + llms.txt (37 语言)
  && node scripts/generate-data-json.mjs # 2. 生成 i18n 构建数据 → src/i18n/generated/
     #    page-content.json (~6.8 MiB, 全量) + site-data.ts (2.2 MiB, 仅 site-* 键)
     #    content-v2* 键被排除 (由 src/data/content-v2.ts 直接读 YAML)
     #    page-content.json 绝不写入 public/ (Cloudflare Pages 单文件 ≥25 MiB 会被拒)
  && npx tsx scripts/generate-geo-files.ts # 3. 生成地理文件 (entity.json + llms-full.txt)
  && node scripts/_gen-uiall.cjs         # 4. 生成 ui-all.ts (合并 37 语言翻译)
  && node scripts/_gen-pages.cjs         # 5. 从 JSON 生成 pages/*.ts 模块 (~110 个)
  && node scripts/gen-icon-svgs.cjs      # 6. 生成图标 SVG
  && node scripts/generate-image-dimensions.mjs # 7. 解析全站图片宽高 (image-dimensions.json, CLS 修复)
  && astro build                         # 8. Astro 构建 (生成 ~645 页面)
  && node scripts/mirror-root-en.mjs     # 9. 镜像英文根级页面到 /en/
  && node scripts/generate-sitemaps.mjs  # 10. 生成各语言 sitemap
  && node scripts/generate-merchant-feed.mjs # 11. GMC 商品 Feed (门禁: MDX price×100==checkout unitAmount + 图片存在)
  && node scripts/validate-dist.mjs      # 12. dist 全量校验门禁 (死链/缺失图片/meta)
  && node scripts/fold-untranslated-canonical.mjs # 13. 降级语言 canonical 折叠到 EN
  && node scripts/clean-public-assets.mjs # 14. 清理公共资源
  && node scripts/generate-ai-corpus.mjs # 15. AI 知识语料 → dist/ai-corpus/*.json + manifest (ai-worker /api/reindex 消费)
```

构建结果: 约 **645 个页面** (37 语言; 降级语言 EN-fallback + canonical 折叠, 不复制整站), 输出到 `dist/` 目录。

**Astro 7 注意事项**:

- `compressHTML: true` 已在 `astro.config.ts` 显式设置 (Astro 7 默认 jsx 压缩)
- Rust 编译器严格模式: `.astro` 前端禁止顶层 `return` (如 `[category].astro` 的 redirect 分支需用无 return 写法), 内联 `<script>` 顶层 `return` 需包 IIFE
- `markdown.processor` 使用 `unified({ remarkPlugins, rehypePlugins })`
- npm 安装**无需** `--legacy-peer-deps` (astro-auto-import 0.5.2 起 peer 可干净解析)
- **lockfile 纪律**: CI 的 `npm ci` 要求 lock 与 registry 上 range 内**最新版本**一致 — 依赖发布新版本 (eslint/@typescript-eslint 等) 时 CI 会报 `EUSAGE: lock file's X does not satisfy X`, 需运行 `npm update` 后提交 lock (普通 `npm install` 不会 bump range 内版本)
- `package.json` overrides 锁定 `"vite": "^8"` + `"yaml": ">=2.8.3"`
- `scripts/patch-worker.mjs` (server 模式子域路由注入) 是**历史遗留**, 在 `output: 'static'` 下不执行, 不属构建管线

---

## 4. 国际化 (i18n) 系统

### 4.1 概述

网站支持 **37 种语言** (i18n-config.json):

- **16 种本地化语言** (含 en): 有完整翻译链 — en, fr, de, es, pt, ar (RTL), it, ru, pl, nl, sv, no, el, fi, da, ... (14 种非英语言 UI 键 ×1,721 完全对齐)
- **其余语言**: EN-fallback + `fold-untranslated-canonical.mjs` 将 canonical 折叠到 EN 根页 (避免翻译缺口被搜索引擎判为重复/薄内容)

```
en: English   fr: Français   de: Deutsch   es: Español
pt: Português  ar: العربية (RTL)  it: Italiano  ru: Русский
pl: Polski    nl: Nederlands  sv: Svenska   no: Norsk
el: Ελληνικά  fi: Suomi     da: Dansk
(完整 37 语言清单见 src/i18n/generated/i18n-config.json)
```

### 4.2 翻译数据链 (关键路径)

```
ui/*.ts (自动生成的翻译键值对文件)
  ↓
ui-all.ts (getUiForLang(lang) 函数)
  ↓
Header.astro / Footer.astro / 各页面
  (通过 getUiForLang(locale) 直接获取翻译)
```

**核心函数调用关系:**

1. **`getUiForLang(lang)`** (`src/i18n/generated/ui-all.ts:50`)
   - 从 15 个静态导入的语言模块 `ui/*.ts` 中查找
   - 返回: `(lang && map[lang]) || map.en || {}`
   - 这是**所有页面获取翻译的唯一正确入口**

2. **`setLang(lang)`** (`src/i18n/config.ts:38`)
   - 将指定语言的翻译数据**原地变异**到共享对象 `_ui` 上
   - 由 `Layout.astro:52` 调用
   - **⚠️ 存在竞态问题**: 由于 `_ui` 是模块级可变对象, 在 Astro 静态构建的并行渲染中 (`output: 'static'`, ~645 页面), 一个页面的 `setLang()` 可能覆盖另一个页面的数据

3. **`getPageContent(lang, page)`** (`src/i18n/page-content.ts:13`)
   - 从缓存中获取页面内容数据 (由构建脚本生成)
   - 用于页面级内容 (about, contact, request-quotation 等)

4. **`getLangFromUrl(url)`** (`src/i18n/utils.ts:3`)
   - 从 URL 路径中提取语言代码

### 4.3 修正后的翻译获取方式

**✅ 正确方式 (所有已修复的页面):**

```ts
import { getUiForLang } from '~/i18n/generated/ui-all';
const t = (key: string) => getUiForLang(locale)?.[key] || key;
// 直接使用 getUiForLang, 不依赖共享 _ui 对象
```

**❌ 错误方式 (已全部替换):**

```ts
import { ui } from '~/i18n/config';
// 使用 (ui as any)[key] — 依赖共享可变对象, 会产生竞态
```

### 4.4 语言检测流程 (运行时)

1. Cloudflare Pages Functions `_middleware.ts` 处理请求:
   - 检测 URL 是否有语言前缀
   - 如果没有, 通过 cookie → cf-ipcountry → Accept-Language 检测语言
   - 非英语用户重定向到对应语言 (302)
   - 英语 `/en/` 重定向到 `/` (308)
2. Astro 中间件 `src/middleware.ts` 设置 `context.locals.lang`
3. 布局 `Layout.astro` 调用 `setLang(currentLang)` 设置 UI 数据

### 4.5 导航翻译系统 (navTextMap + i18n-config.json + routing.ts)

导航的翻译与其他内容不同：系统**只加载英文** `navigation.yaml`，然后通过 `t()` 函数实时翻译。

**渲染流程:**

```
navigation.yaml (英文 text 值)
  ↓
Header.astro / Footer.astro 的 t() 函数
  ↓
navTextMap: 将英文 text 映射到翻译键 (如 "Buyer Center" → "nav.buyerCenter")
  ↓
i18n-config.json: 将翻译键映射到各语言文本 (如 "nav.buyerCenter" → "买家中心")
  ↓
localizeHref() (src/i18n/routing.ts): 匹配 LOCALIZED_ROUTES → 添加 /{lang} 前缀
  ↓
显示翻译后的文本
```

**共享路由模块** `src/i18n/routing.ts`:

- 原本 `LOCALIZED_ROUTES` 在 Header.astro 和 Footer.astro 中各定义一份（~200 行重复）
- 现已提取到共享模块，两个组件各减少 101 行
- 提供 `localizeHref()`、`entityForHref()` 等工具函数
- 新增工厂页面时需在此注册路由

**⚠️ 重要: 添加新导航项时必须同步更新四处:**

1. **`src/data/site/navigation.yaml`** — 添加导航结构 (英文 text + href)
2. **`src/components/widgets/Header.astro` 和 `Footer.astro` 的 `navTextMap`** — 添加英文 text → 翻译键的映射
3. **`public/data/i18n-config.json`** — 为所有 37 种语言添加翻译键和对应的翻译文本
4. **`src/i18n/routing.ts` 的 `LOCALIZED_ROUTES`** — 如果新页面需要语言前缀，注册路由

**具体步骤:**

```bash
# 1. 编辑 navigation.yaml 添加新项
# 2. 编辑 Header.astro 和 Footer.astro，在 navTextMap 中添加映射:
#    'New Nav Text': 'nav.newKey',
# 3. 编写脚本或手动编辑 i18n-config.json，为所有 37 语言添加:
#    "nav.newKey": "翻译文本"
# 4. 如果新页面在 [lang]/ 路由下，在 routing.ts 的 LOCALIZED_ROUTES 中添加路径
```

**❌ 常见错误（本次修复的问题）:**

- 只修改了 `navigation.yaml` 和 `navigation.zh.yaml` 等本地化 YAML 文件
- 忘记更新 `navTextMap` 和 `i18n-config.json`
- **结果**: 导航显示英文原文，因为 `t()` 找不到映射键，返回英文 text 作为 fallback

**✅ 正确做法:**

- 本地化 YAML 文件 (`navigation.zh.yaml` 等) **仅供 Keystatic CMS 编辑参考**，不会影响渲染
- 实际的翻译数据在 `i18n-config.json` 中
- 添加新导航项后，务必检查 `navTextMap` 和 `i18n-config.json` 是否同步更新
- **新增品牌/行业页面的导航项**: `Why Felizbay` (Company)、`For Schools` (Solutions)、`For Distributors` (Solutions) 已同步更新到 `navigation.yaml`

### 4.6 翻译键命名约定

翻译键使用点号分隔的层级命名:

```
nav.products       → "Shop Pools" / "Piscines" / "Pools" ...
home.resources.buyersCenter → "Buyers Center"
product.pageDesc   → (所有语言文件中缺失, 从未被提取脚本生成)
```

### 4.7 翻译脚本系统 (2026-08 里程碑)

**翻译成果统计:**

| 指标             | 值                                                                  |
| ---------------- | ------------------------------------------------------------------- |
| i18n 键总数      | 1,721 (EN)                                                          |
| 非英语语言       | 14 (fr/de/es/pt/ar/it/ru/pl/nl/sv/no/el/fi/da)                      |
| 键完全对齐       | 14语言 × 1,721 = 24,094 (0 missing/extra)                           |
| sameAsEn 已翻译  | 3,807 (Google Translate主 + MyMemory备)                             |
| 孤立键已清理     | 2,456 (ar:801, no:798, el:100, fi:757)                              |
| Page YAML 已翻译 | 252/252 (14语言 × 18页面)                                           |
| 剩余 sameAsEn    | 808 (540技术术语 + 109同源词 + 29品牌名 + 124短词/数字 + 6确认保留) |

**翻译脚本:**

| 脚本                                 | 用途                                                    | 标志                   |
| ------------------------------------ | ------------------------------------------------------- | ---------------------- |
| `scripts/translate-i18n-keys.mjs`    | 翻译 sameAsEn i18n 键 (Google Translate主 + MyMemory备) | `--dry-run`, `--force` |
| `scripts/fill-missing-i18n-keys.mjs` | 用 EN 副本填充缺失 i18n 键 (翻译前 fallback)            | —                      |
| `scripts/check-translations.mjs`     | 校验 14 语言 i18n 键对齐                                | —                      |

**翻译缓存:** `.cache/i18n-translate-cache.json` (git 跟踪, 位于 `.cache/`)

**不翻译规则:** 技术术语 (Drop-Stitch/PVC/OEM/ISO/FAQ/WhatsApp/Felizbay) 所有语言保留原文。同源词 (如法语 "Certifications" = EN "Certifications") 也保留原文——Google Translate 也返回相同值。

---

## 5. 产品页面系统

### 5.1 数据源

产品数据有两层:

**A. 结构化数据** (`src/data/products.ts`):

- TypeScript 数组 `ProductRecord[]`
- 包含 5 个产品记录 (矩形/圆形/灰色圆形 Drop Stitch 泳池 + 方形/圆形 SPA 泳池, 覆盖 4 系列 48 SKU)
- 字段: `id`, `name`, `category`, `desc`, `definition`, `specs`, `faq` 等
- 所有字段为**英语**, 无翻译

**B. 多语言翻译文本** (`src/data/product-texts.ts`):

- 按语言 × 产品 ID 组织的翻译字典
- 覆盖字段: `name`, `desc`, `definition`, `problem`, `howItWorks`, `audience`, `ai_use_cases`, `ai_comparison`, `ai_faq`
- **注意**: `product.pageDesc` 在所有语言的 UI 生成文件中均**缺失** (提取脚本未包含此键)

**C. 内容集合** (`src/content.config.ts`):

- Astro `defineCollection` 从 `src/content/product/` 加载
- 包含 `title`, `summary`, `description`, `image`, `gallery`, `specs`, `tags` 等

### 5.2 产品页面路径

产品页面有两种路径:

1. **多语言版本**: `/[lang]/products/[slug].astro` (37 种语言 × 产品数)
2. **英语直连**: `/products/[slug].astro` (无语言前缀, 仅英语)

**产品列表页**:

- `/[lang]/products/index.astro` — 每种语言生成一个列表
- `/products/index.astro` — 英语列表

**产品对比页**:

- `/[lang]/products/compare.astro` — 多语言对比
- `/products/compare.astro` — 英语对比

### 5.3 产品详情页渲染流程

```
/content/product/*.md(x)  (内容集合)
  ↓  Astro Content Collections + getNormalizedProduct()
products 数组 (包含 title, summary, description, specs, tags...)
  ↓
[slug].astro:
  1. 从 products 数组找到对应产品
  2. 从 productRecords (products.ts) 获取结构化数据
  3. 生成 JSON-LD Schema
  4. 渲染 ProductLayout
```

### 5.4 产品 Tags 渲染注意事项

Tags 来自内容集合, 正常化为 `{slug, title}` 对象格式:

- 渲染时使用: `String((tag as any)?.title || (tag as any)?.slug || tag || '').trim()`
- **不要直接使用 `{tag}`**, 否则显示 `[object Object]`

### 5.5 产品翻译编辑系统 (15语言)

#### 5.5.1 概述

管理后台支持对 15 种语言的产品翻译进行可视化编辑。翻译数据存储为每产品每语言的 YAML 文件 (`src/data/product-texts/{locale}/{product.id}.yaml`)，在构建时由 `localizeProduct()` 自动合并到产品记录中。

翻译字段限定为纯文本内容 (名称、描述、定义、FAQ 等)，结构化数据 (规格参数、环境、技能水平等) 保持在英文 MDX 中。

#### 5.5.2 数据源层级

```
MDX Frontmatter (English, src/content/products/*.mdx)
  └─ 结构化字段: title, summary, description, gallery, specs, sku, price, tags, environment, water_condition, skill, definition, problem, howItWorks, audience, ai_use_cases, ai_comparison, ai_faq, ai_specs
       ↓
products.ts (ProductRecord[], src/data/products.ts)
  └─ 所有字段为英文, 包含: id, name, desc, definition, problem, howItWorks, audience, skill, environment, water_condition, safety_rules, safety_level, region, ai_use_cases, ai_specs, ai_comparison, ai_faq
       ↓
product-texts.ts (src/data/product-texts.ts, 4096 行 TS 模块)
   └─ 翻译字典 (8 语言种子: fr/de/es/pt/it/ru/pl/ar, 其余语言回退英文)
       ↓
YAML 文件 (src/data/product-texts/{locale}/{product.id}.yaml) ← 新增
  └─ 每产品每语言的 YAML 文件, 通过后台管理面板编辑, 优先于 TS 模块
```

**回退链 (Fallback Chain)**:

1. YAML 文件存在 → `yaml.load()` 读取, 合并到 `ProductRecord`
2. YAML 不存在 → 从 `product-texts.ts` TS 模块获取翻译
3. 都不存在 → 使用英文原文

#### 5.5.3 翻译字段清单

| YAML Key        | 表单 Input              | 映射方式              | 说明         |
| --------------- | ----------------------- | --------------------- | ------------ |
| `name`          | `title`                 | `data-fm-path="name"` | 产品名称     |
| `summary`       | `summary`               | name 匹配             | 一句话简介   |
| `desc`          | `description`           | `data-fm-path="desc"` | 详细描述     |
| `definition`    | `definition`            | name 匹配             | 产品定义     |
| `problem`       | `problem`               | name 匹配             | 解决的问题   |
| `howItWorks`    | `howItWorks`            | name 匹配             | 工作原理     |
| `audience`      | `audience`              | name 匹配             | 目标受众     |
| `ai_use_cases`  | `ai_use_cases[]`        | repeater              | 使用场景数组 |
| `ai_comparison` | `ai_comparison`         | name 匹配             | 竞品对比     |
| `ai_faq`        | `ai_faq_q` / `ai_faq_a` | repeater              | 常见问题数组 |

#### 5.5.4 渲染流程 (Public Page)

```
[lang]/products/[slug].astro
  ↓
productRecords.find((p) => p.id === product.slug) → recRaw
  ↓
localizeProduct(recRaw, lang)  (src/utils/product-i18n.ts)
  ├─ 1. fs.existsSync('src/data/product-texts/{locale}/{id}.yaml')
  │     └─ 是 → yaml.load() → merge into ProductRecord
  ├─ 2. 否 → productTexts[locale]?.[id] → merge into ProductRecord
  └─ 3. 都无 → 返回原始 ProductRecord (英文)
  ↓
rec (本地化 ProductRecord) → 页面各 section 渲染
```

#### 5.5.5 管理后台编辑流程

##### 读取 (Load)

```
页面加载 (locale='en'):
  FormDataLoader.astro 自动执行:
  1. fetch GET /api/admin/read?format=frontmatter&path=src/content/products/{slug}.mdx
  2. Worker 解析 MDX frontmatter → 返回 { parsed: frontmatter, body }
  3. fillFields(data) 填充所有表单字段
  4. fillRepeater() 填充 gallery, specs, ai_faq 等重复区域

切换语言 (locale='zh', 用户选择):
  ProductForm.astro inline script 执行:
  1. updateLangUI() 隐藏非翻译字段区域 (gallery, specs, environment, body, SEO 等)
  2. 显示提示 "Editing translation — only text fields shown"
  3. FormDataLoaderFn() 执行:
     a. fetch GET /api/admin/read?format=yaml&path=src/data/product-texts/zh/{slug}.yaml
     b. Worker: yaml.load(decoded) → 返回 { parsed: { name, desc, ... } }
     c. 仅填充 TRANSLATABLE_FIELDS 中的输入
     d. 填充 ai_use_cases 和 ai_faq 重复区域
```

##### 保存 (Save)

```
用户点击 "Save Draft":
  save(branch) 函数检查 locale:

  英语 (locale === 'en'):
  ├─ collectFrontmatter(data):
  │   ├─ title, publishDate, draft, inStock, featured
  │   ├─ sku, summary, description, image, category
  │   ├─ gallery[], specs[], tags[], environment[], water_condition[]
  │   ├─ definition, problem, howItWorks, audience, skill
  │   ├─ ai_use_cases[], ai_comparison, ai_faq[], ai_specs{}
  │   ├─ price{}, metadata{} (SEO)
  │   └→ 返回 frontmatter 对象
  ├─ serializeFrontmatter(fm) → "---\n...\n---"
  ├─ content = frontmatter + body
  └─ POST /api/admin/update { content, sha, message }

  翻译 (locale !== 'en'):
  ├─ collectTranslatable(data):
  │   ├─ name, summary, desc, definition, problem
  │   ├─ howItWorks, audience, ai_comparison
  │   ├─ ai_use_cases[], ai_faq[]{q, a}
  │   └→ 返回 { name, summary, desc, ... }
  ├─ 使用 form.dataset.sha (YAML 文件 SHA, 非 MDX _sha)
  └─ POST /api/admin/update { format: 'yaml', data: { ... }, sha }
      └─ Worker: yaml.dump(data, { lineWidth: -1 }) → b64encode → GitHub PUT
```

#### 5.5.6 关键文件

| 文件                                        | 作用                                                                                     |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/components/admin/ProductForm.astro`    | 产品编辑表单: 15 语言选择器、字段分组、语言切换 JS (show/hide/reload)                    |
| `src/components/admin/FormDataLoader.astro` | 通用数据加载器: 从 GitHub 读取 frontmatter/YAML 并填充表单                               |
| `src/pages/keystatic/products/[slug].astro` | 后台产品编辑页面: collectFrontmatter(), collectTranslatable(), save()                    |
| `src/utils/product-i18n.ts`                 | 构建时翻译合并: YAML 优先 → TS 模块回退 → 英文默认                                       |
| `src/data/product-texts.ts`                 | 翻译字典: 15 语言 × ~40 产品的 TS 模块 (4096 行)                                         |
| `src/data/products.ts`                      | 产品结构化数据: ProductRecord[] (63 产品)                                                |
| `workers/admin-worker/index.ts`             | Worker API: `/api/admin/read` (frontmatter+yaml), `/api/admin/update` (支持 format:yaml) |

#### 5.5.7 重要注意事项

1. **字段名映射**: YAML 使用 `name` (非 `title`) 和 `desc` (非 `description`)。表单输入通过 `data-fm-path` 属性进行映射：
   - `title` input → `data-fm-path="name"`
   - `description` textarea → `data-fm-path="desc"`
   - 其他字段 input name 与 YAML key 一致

2. **SHA 独立管理**: YAML 文件的 SHA 存储在 `form.dataset.sha` 中，与 MDX 文件的 `_sha` hidden input 完全独立。首次保存新翻译 (文件不存在) 时不带 SHA，后续更新使用 `form.dataset.sha`。

3. **UTF-8 编码**: admin-worker 必须使用 `b64encode()` (基于 `TextEncoder`) 而非 `btoa()` 进行 Base64 编码。`btoa()` 无法处理多字节 UTF-8 字符 (中文、法语重音等)，会导致乱码。详见 §11.8 编码铁律。

4. **不可翻译字段**: `environment`, `water_condition`, `skill`, `safety_rules`, `safety_level`, `region` 等字段在英文 `ProductRecord` 中定义，不参与翻译。切换语言时这些字段的编辑区域会被隐藏。

5. **构建时依赖**: `product-i18n.ts` 使用 `fs.existsSync` + `fs.readFileSync` 在 Node.js 构建环境下读取 YAML 文件。YAML 文件必须通过 `git push` 存在于仓库中才能被构建使用。

6. **新建翻译文件**: 当某语言的某个产品首次保存时，`save()` 不传 SHA → Worker 的 `/api/admin/update` 视为创建新文件。YAML 文件写入 draft 分支，发布后合并到 main。

### 5.6 PDP JSON-LD: ProductGroup 与变体级 FOB offers (2026-11-03)

PDP JSON-LD 按销售渠道分两支 (`src/pages/products/[slug].astro` 与 `src/pages/[lang]/products/[slug].astro`, 两模板必须同步修改):

- **零售页 (有 Stripe SKU)**: 单一 `Product` + 精确 `Offer` (零售价), 不暴露工厂尺寸变体。
- **批发页 (无 SKU)**: `ProductGroup` — 组级 `AggregateOffer` (`lowPrice` = 系列最低 FOB, `eligibleQuantity` MOQ 20, FOB Qingdao 基准) + `hasVariant[]` 每变体携带已核实目录事实 (`sku` 货号 / `size` / `weight` 打包重量) 与 **变体级 `Offer`** (2026-11-03 新增): `price` = `pool-catalog.ts` 的 `fobUsd` (与 `/products/specs/` 公开价格表同一 SSOT)、`priceCurrency: USD`、`eligibleQuantity` MOQ 20、`additionalProperty` 注明 FOB Qingdao 基准 — 使 AI 引擎可按尺寸回答批发价格问题。

变体映射: 模板内 `SERIES_BY_SLUG` 将产品 slug 映射到 `poolSeries` 系列 id (round / rect-square / hot-tub-round / hot-tub-square-rect); `JsonLd.astro` 通过 `Array.isArray(product.hasVariant)` 判定输出 ProductGroup 还是 Product。prod-smoke 断言 rectangular PDP 含 `"sku":"SR220815"` 与 `"@type":"Offer"` (EN + 37 语言)。

---

## 6. 数据流与渲染管线

### 6.1 数据流向

```
                       ┌──────────────────────┐
                       │  scripts/ 构建脚本     │
                       │  (geo-build / _gen-*) │
                       └────────┬─────────────┘
                                ↓
  ┌─────────────────────────────────────────────┐
  │  生成数据:                                   │
  │  src/i18n/generated/ui/*.ts  (15 语言翻译)   │
  │  src/i18n/generated/ui-all.ts (合并入口)     │
  │  src/i18n/generated/pages/*  (页面内容)      │
  │  src/i18n/generated/site-data.ts (site-* 键)  │
  │  src/i18n/generated/i18n-config.json        │
  └─────────────────────────────────────────────┘
                                ↓
  ┌─────────────────────────────────────────────┐
  │  Astro 静态构建 (output: 'static')           │
  │  并行渲染 ~645 个页面                        │
  │  每个页面独立运行 frontmatter script         │
  └─────────────────────────────────────────────┘
                                ↓
  ┌─────────────────────────────────────────────┐
  │  dist/ 静态文件                              │
  │  Cloudflare Pages 部署                       │
  └─────────────────────────────────────────────┘
```

### 6.2 关键注意事项

- **Astro `output: 'static'`**: 所有页面在构建时预渲染, 无 SSR
- **并行渲染竞态**: ~645 页面同时渲染, `setLang()` 修改模块级 `_ui` 对象会导致数据竞争
- **解决方案**: 所有组件使用 `getUiForLang(locale)` 直接获取翻译, 不依赖 `_ui`
- **`setLang()` 保留**: `Layout.astro` 仍调用 `setLang()`, 但仅为了向后兼容 (老代码可能仍引用 `ui`)

---

## 7. Cloudflare Workers

项目有 **5 个独立的 Cloudflare Workers** (+ 共享代码目录 `workers/shared/`):

> `seo-worker` (Felizbay-seo) 已于 2026-08-18 删除 — 其端点 (search/geo-score/page-inspect/seo/*) 均为硬编码演示响应, 无生产调用, 且 CI 不部署。

| Worker     | 名称                  | 路由                                                                                   | 存储                 | 用途                                                                                                 |
| ---------- | --------------------- | -------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| Admin      | `felizbay-admin`      | `/api/admin/*`, `/api/auth/*`                                                          | D1, R2 (data)        | better-auth 认证, GitHub CRUD, D1 查询, 询盘 CSV 导出 + 附件下载                                     |
| AI         | `felizbay-ai`         | `/api/chat*`, `/api/ask*`, `/api/search*`, `/api/embed*`, `/api/reindex*`, `/api/ai/*` | Vectorize, R2 (data) | AI 问答/搜索/嵌入 + 知识库增量重建 (cron: 每天 3AM, corpus 哈希跳过) + R2 限流/答案缓存/每日嵌入预算 |
| Automation | `felizbay-automation` | `/api/automation/*`                                                                    | R2 (data), D1        | 定时任务 (cron: 每天 2AM, D1 清理 + IndexNow)                                                        |
| Contact    | `felizbay-contact`    | `/api/contact*`                                                                        | D1, R2 (data)        | 联系表单 (Turnstile + 限流 + D1 存储 + 可选附件上传 R2)                                              |
| News       | `felizbay-news`       | `/{lang}/news*`, `/{lang}/rss.xml`, `/sitemap-news.xml`, `/llms/news*`                 | D1 (news 表)         | 新闻/RSS/新闻 sitemap (D1 驱动, 无静态页)                                                            |

**D1 数据库 `Felizbay-db`** (admin/contact/news/automation 共享) 主要表:

- `inquiry` — 联系表单提交 (IP/UA/语言/附件 R2 key `logoKey`)
- `news` — 新闻文章 (news-worker + admin 撰写)
- `rate_limit` — 联系表单按 IP 限流 (每 IP 每小时 5 次)
- `user` / `session` / `account` / `verification` / `rateLimit` — better-auth 会话管理与认证限流
- 迁移位于 `migrations/`，由 `wrangler d1 migrations apply Felizbay-db` 应用 (CI 首次部署自动执行)

### 7.1 3MB Worker 限制

**每个 Worker 的编译后 JS 必须 < 3MB** (Cloudflare Workers 的限制)。

如果在 Worker 中遇到 `Error: Your worker size is 3.1 MB which exceeds the 3 MB limit`, 说明引入了过大的依赖。

**解决思路**:

- 检查 `import` 是否引入了大型库
- 数据放在 R2 / D1，不要打包进 Worker
- 考虑将大逻辑拆分为多个 Worker
- 避免在 Worker 中 `import` 整个 Astro 项目的 `src/` 文件

### 7.2 Worker 构建和部署

```bash
# 部署单个 Worker
npm run deploy:worker-contact
npm run deploy:worker-ai
npm run deploy:worker-admin
npm run deploy:worker-news
npm run deploy:worker-automation

# 部署所有 5 个 Worker (scripts/deploy-workers.mjs, 并行执行 ~5x 加速)
npm run deploy:workers
```

### 7.3 管理员认证配置 (better-auth)

管理后台登录 (`/login`, `/keystatic/*`) 使用 **better-auth**，运行在 `felizbay-admin` Worker 上（`workers/shared/auth.ts` 是共享配置）：

| 项目       | 说明                                                                                   |
| ---------- | -------------------------------------------------------------------------------------- |
| 登录方式   | Google OAuth + 邮箱/密码（可选 GitHub OAuth，配置了 `GITHUB_CLIENT_ID/SECRET` 时启用） |
| 会话存储   | **D1** `session` 表 (`drizzleAdapter`, sqlite)                                         |
| 管理员角色 | `ADMIN_EMAILS` secret (逗号分隔的邮箱列表) → `isAdminEmail()` 判定 + admin 插件角色    |
| 验证码     | 登录页 Turnstile (`TURNSTILE_SECRET_KEY`)                                              |
| 密码重置   | email/password 启用了 `sendResetPassword`（占位实现）                                  |
| 用户管理   | `/keystatic/users`（admin 插件：ban/delete/impersonate/session 管理）                  |

**Secrets（通过 `wrangler secret put` 或 CI `secret bulk` 设置）:**

```bash
npx wrangler secret put BETTER_AUTH_SECRET --name felizbay-admin   # 会话签名密钥 (openssl rand -base64 32)
npx wrangler secret put ADMIN_EMAILS --name felizbay-admin         # 管理员邮箱列表
npx wrangler secret put GOOGLE_CLIENT_ID --name felizbay-admin     # Google OAuth
npx wrangler secret put GOOGLE_CLIENT_SECRET --name felizbay-admin
npx wrangler secret put TURNSTILE_SECRET_KEY --name felizbay-admin # 登录验证码
npx wrangler secret put GITHUB_TOKEN --name felizbay-admin         # CMS 内容写入 PAT
npx wrangler secret put SESSION_SECRET --name felizbay-admin       # legacy HMAC 回退
```

> `SESSION_SECRET` + `src/lib/auth.ts` (HMAC-SHA256) 保留为 **legacy 回退**，与旧 cookie (`ks-admin-session`) 兼容；新登录全部走 better-auth cookie (`csr_session`)。`ADMIN_USERNAME / ADMIN_PASSWORD_HASH` 与 `src/data/admin-auth.json` 同样仅作 legacy 回退，不推荐继续使用。

**登录字段对应关系：**

- 登录页表单提交到 better-auth 端点 (`/api/auth/...`)，不再是自定义 `/api/auth/login` 的账号密码
- 默认凭据不再存在——管理员通过 Google OAuth 或邮箱注册，邮箱必须在 `ADMIN_EMAILS` 中才会获得 admin 角色

---

## 8. Cloudflare Pages Functions

### 8.1 `functions/_middleware.ts`

Cloudflare Pages 自带的中间件, 在请求到达静态文件之前执行:

**主要功能**:

1. **R2 资源跳转**: 将 `/images/*` 和 `/files/*` 请求 301 重定向到 `https://assets.felizbay.com`
2. **国际化检测**: 检测用户语言, 非英语用户 302 重定向到对应语言版本
3. **管理员页面保护**: `/keystatic`, `/admin` 路径的访问控制

**语言检测优先级**:

1. Cookie `x-user-locale`
2. `cf-ipcountry` (Cloudflare 地理 IP)
3. `Accept-Language` 请求头
4. 默认英语 (`en`)

**注意**: 此文件是 Cloudflare Pages Functions, **不是 Astro 中间件**, 运行在边缘环境。它不共享 Node.js 模块, 使用独立的运行时。

### 8.2 `I18N_EXCLUDED` — 国际化排除路径

**用途**: 中间件中的 `I18N_EXCLUDED` 列表定义了哪些路径不需要执行语言检测和重定向。

当前列表 (`functions/_middleware.ts`): `/api`, `/keystatic`, `/admin`, `/login`, `/internal`, `/images`, `/assets`, `/favicon`, `/llms`。带扩展名的 URL（静态资源）也直接放行 (`hasExtension()`)。

**根级路径 vs 本地化路径**: 不在排除列表中的无扩展名路径会按 cookie / Accept-Language 判定语言并重定向到 `/{lang}/...`；因此任何根级英文页面都必须有对应的 `[lang]/` 路由（或镜像，见 `mirror-root-en.mjs`），否则本地化 URL 会 404。

**历史模式 (已退役)**: 船时代的 `solutions-*` / `industries-*` 根级页面曾用「根级页面 + `I18N_EXCLUDED` + `[lang]/` 重定向壳 (`<meta http-equiv="refresh">` + `noindex` + canonical)」处理本地化 404。这些路由已在 2026 泳池转型中全部下线，新增页面请勿复用该模式——直接走系统路由表（见 §导航）。

---

## 9. R2 存储

### 9.1 Bucket 配置

| Bucket 名称       | 绑定名        | 用途                       |
| ----------------- | ------------- | -------------------------- |
| `felizbay-assets` | `ASSETS_R2`   | 静态资产 (图片, 文件)      |
| `felizbay-data`   | `DATA_BUCKET` | 数据 (AI 索引, 自动化任务) |

### 9.2 资产上传与自动 prune (2026-10)

```bash
npm run build:r2   # 或 node scripts/fast-upload-r2.mjs
```

上传后的资产通过 `https://assets.felizbay.com/...` 访问。

**自动 prune**: `fast-upload-r2.mjs` 在每次上传后自动清理 R2 中"本地已不存在"的过期对象（覆盖 `data/`、`images/`、`files/` 前缀）。护栏：

- 本地前缀为空 → 跳过该前缀的 prune
- 过期对象 > 200 个 → 中止 prune 并告警（防止误删事故扩散）
- prune 失败**不会**使部署失败（仅告警）

验证记录：P6 WebP 迁移后 15 张旧 PNG/JPG 已被自动 prune（404 确认），新 WebP 均 200。见 `docs/technical-audit-2026-10.md` §2.3。

### 9.3 URL 重写

静态文件中的图片 URL 会被重写:

- 原始: `/images/product/foo.jpg`
- 重写后: `https://assets.felizbay.com/images/product/foo.jpg`

由 `functions/_middleware.ts` 处理: 匹配 `/images/*` 和 `/files/*` → 301 重定向到 `ASSETS_BASE`。

---

### 10.4 GitHub Actions CI/CD

> **目前状态**: 两个工作流均已投入使用。`ci.yml` 是 PR 质量门禁，`deploy.yml` 是 main 分支部署流水线（含 Cloudflare 凭据守卫，未配置凭据时自动跳过 Cloudflare 步骤而不报错）。

**PR 门禁** (`.github/workflows/ci.yml`):

```text
pull_request →
  npm ci
  → npm run check (astro check + eslint + prettier + i18n, 0 errors 门禁)
  → npm run build (含 PUBLIC_TURNSTILE_SITE_KEY)
  → wrangler deploy --dry-run (admin / contact / news / automation 4 个 Worker 编译检查)
```

**部署流水线** (`.github/workflows/deploy.yml`, push to main):

```text
guard (探测 CLOUDFLARE_API_TOKEN/ACCOUNT_ID → enabled=true|false)
  → npm ci → npm run check → npm run build
  → node scripts/fast-upload-r2.mjs        (上传资产到 R2 + 自动 prune 本地已删除的 R2 对象)
  → npx wrangler pages deploy dist/        (部署 Pages)
  → 注入 CF_PROD_D1_ID 到 workers/*/wrangler.toml
  → wrangler d1 migrations apply (首次) + seed-news.mjs (news 表为空时)
  → wrangler secret bulk (contact: RESEND/Turnstile; admin: better-auth/Google/Turnstile)
  → npm run deploy:workers                (5 个 Worker 并行部署)
  → curl purge_cache (清 CDN 缓存)
```

### 10.5 必需的 GitHub Secrets

> **首次部署完整步骤**（Cloudflare 资源创建、域名 NS 迁移、第三方密钥、Secrets 设置路径、验证清单）见 **[`SETUP.md`](./SETUP.md)**。CI 只向已存在的资源内部署，Pages 项目 / R2 桶 / D1 / zone 均需先手动创建。

| Secret 名称               | 用途                                               | 来源                                           |
| ------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`    | 用于 `wrangler deploy` 的 Cloudflare API 令牌      | Cloudflare Dashboard → My Profile → API Tokens |
| `CLOUDFLARE_ACCOUNT_ID`   | Cloudflare 账户 ID                                 | Cloudflare Dashboard 右侧                      |
| `CLOUDFLARE_ZONE_ID`      | Zone ID (CDN 缓存清理)                             | Cloudflare Dashboard → Domain                  |
| `CF_PROD_D1_ID`           | D1 数据库 ID (注入 wrangler.toml)                  | `wrangler d1 list`                             |
| `TURNSTILE_SITE_KEY`      | Turnstile 站点密钥 (公开, 注入构建)                | Cloudflare Turnstile 面板                      |
| `TURNSTILE_SECRET_KEY`    | Turnstile 密钥 (contact + admin Worker)            | Cloudflare Turnstile 面板                      |
| `RESEND_API_KEY`          | Resend 邮件 API                                    | Resend Dashboard                               |
| `CONTACT_EMAIL_TO`        | 联系表单通知收件人                                 | —                                              |
| `BETTER_AUTH_SECRET`      | better-auth 会话签名密钥                           | `openssl rand -base64 32`                      |
| `ADMIN_EMAILS`            | 管理员邮箱列表 (逗号分隔)                          | —                                              |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth 登录                                  | Google Cloud Console                           |
| `SESSION_SECRET`          | legacy HMAC 回退 (缺省时回落到 BETTER_AUTH_SECRET) | `openssl rand -hex 32`                         |

> 部署无需手动操作：push 到 `main` 自动完成构建、部署、D1 迁移、secret 同步与缓存清理。本地手动部署命令仍可用：`npm run deploy:all`。

---

## 10. 部署架构与限制

### 10.1 部署架构图

```
用户请求
  ↓
Cloudflare CDN (全球边缘网络)
  ├─ www.felizbay.com/* → apex 301 (Dashboard Redirect Rule, 单跳, 路径保留 — 2026-10 配置, 非 _redirects)
  ├─ Pages Functions (_middleware.ts) → 语言检测 / 重定向
  └─ 静态文件 (dist/)
       ├─ / → index.html (英语首页)
       ├─ /fr/ → 法语页面
       ├─ /products/ → 英语产品页
       └─ ...
  ↓
API / 动态请求
  ├─ ai-worker → Vectorize + R2
  ├─ admin-worker → better-auth + GitHub CRUD + D1
  ├─ contact-worker → D1 + Turnstile + Resend
  ├─ news-worker → D1 (news/rss)
  └─ automation-worker → D1 清理 + IndexNow + R2 (定时任务)
```

### 10.2 关键限制

| 限制项               | 值                                | 说明                             |
| -------------------- | --------------------------------- | -------------------------------- |
| **Workers 编译大小** | **< 3 MB**                        | 每个 Worker 的 JS 必须小于 3MB   |
| **Pages 部署**       | `npx wrangler pages deploy dist/` | 纯静态, 无 SSR                   |
| **页面数量**         | ~645 页                           | 37 语言, 降级语言 canonical 折叠 |
| **构建时间**         | ~2-3 分钟 (本地实测)              | ~645 页静态渲染 + GEO 生成       |
| **Node 版本**        | >= 22.12.0                        | 项目强制要求                     |
| **包管理**           | npm                               | `npm ci` (CI) / `npm install`    |
| **静态输出**         | `dist/`                           | `output: 'static'`, 无适配器     |
| **D1 数据库**        | `Felizbay-db`                     | inquiry/news/rate_limit/auth 表  |

### 10.3 部署命令

```bash
# 完整部署 (构建 + 部署 Pages + 部署 Workers)
npm run deploy:all

# 或分步:
npm run build                          # 构建
npx wrangler pages deploy dist/        # 部署 Pages
npm run deploy:workers                 # 部署 Workers
node scripts/fast-upload-r2.mjs        # 上传 R2 资产
```

---

## 11. 常见错误及避免方法

### 11.1 `[object Object]` 显示在页面上

**原因**: 直接渲染对象而没有调用 `.title` 或 `.slug` 等属性。

**常见场景**: Tags 渲染。

**修复方法**:

```astro
<!-- ❌ 错误 -->
<span>{tag}</span>

<!-- ✅ 正确 -->
<span>{String((tag as any)?.title || (tag as any)?.slug || tag || '').trim()}</span>
```

### 11.2 导航/页脚显示错误语言

**原因**: 使用了 `(ui as any)[key]` 从共享可变 `_ui` 对象读取翻译, 但 `_ui` 被其他并行渲染的页面覆盖。

**修复方法**:

```text
<!-- ❌ 错误 (依赖共享 _ui) -->
import { ui } from '~/i18n/config';
<span>{(ui as any)['nav.products']}</span>

<!-- ✅ 正确 (直接获取) -->
import { getUiForLang } from '~/i18n/generated/ui-all';
const t = (key: string) => getUiForLang(locale)?.[key] || key;
<span>{t('nav.products')}</span>
```

**注意**: 所有从 `~/i18n/config` 导入 `ui` 或使用 `(ui as any)` 的代码都应该被替换。

### 11.3 页面显示乱码 (garbled Chinese text)

**原因**: 文件编码问题, 非 ASCII 字符在保存时被错误编码。

**修复方法**:

- 确保所有 `.astro`, `.ts`, `.json` 文件使用 **UTF-8 without BOM** 编码
- 检查脚本: `python scripts/find-garbled.py` 或 `python scripts/check-encoding.py`
- 修复脚本: `python scripts/fix-garbled.py`
- 避免在源文件中使用非标准 Unicode 字符

### 11.4 缺失翻译键导致页面显示键名

**原因**: UI 生成脚本未提取某翻译键, 所有语言的 `ui/*.ts` 文件 (`src/i18n/generated/ui/`) 中都缺失。

**示例**: `product.pageDesc` 在所有 `ui/*.ts` 文件中缺失。

**修复方法**:

1. 在 UI 提取脚本 `scripts/_gen-uiall.cjs` 中添加新键
2. 重新运行 `npm run build` 重新生成 `ui/*.ts`
3. 或者在各语言页面中直接使用 `productTexts` 数据 (`src/data/product-texts.ts`)

### 11.5 构建时类型错误 (astro check)

**✅ 当前状态**: `astro check` **0 错误** — 历史上的 ~350 个预存错误（`_keystatic/` 编码问题、Worker 类型问题等）已全部修复，且 `npm run check` 现在是 CI 的门禁（PR 未通过不允许合并）。

**准则**:

- 修改代码后必须运行 `npm run check` 确认 **0 错误 0 警告**
- 新增 Worker 代码注意 Cloudflare 运行时的类型差异（用 `wrangler deploy --dry-run` 验证）

### 11.10 CI `npm ci` 报 EUSAGE (lock 与 package.json 不同步)

**现象**: CI 报 `npm error Invalid: lock file's X@a.b.c does not satisfy X@a.b.d` 或 `Missing: X from lock file` — 通常是依赖发布了 range 内的新版本 (eslint、@typescript-eslint/*、@cloudflare/workers-types 等), 或 lock 由 `--legacy-peer-deps` 生成导致 peer 条目缺失。

**修复**:

```bash
npm update          # 全量更新到 range 内最新 (普通 npm install 不会 bump)
npm ci --dry-run    # 本地验证 lock 与 package.json 同步
npm run build       # 验证构建
```

**预防**: 不要用 `--legacy-peer-deps` 安装 (astro-auto-import 0.5.2 起 peer 可干净解析)；锁变更后提交 `package-lock.json`。

**变体 (2026-11-04, commits `6cda0b7`/`7a614a1`): 本地 npm 11 与 CI npm 10 的去重差异**。本地 `npm update` (Node 26 / npm 11.17) 重写 lock 后，本地 `npm ci --dry-run` 通过，但 CI (Node 22 / npm 10.x) 报 `Invalid: lock file's esbuild@0.25.12 does not satisfy esbuild@0.28.2` — npm 11 的 dedup 把 vite 需要的 esbuild 0.28.2 边折叠到了 0.25.12 条目上，npm 10 的理想树构建器拒绝。**修复/预防**: 刷新 lock 必须用与 CI 相同大版本的 npm — `npx -y npm@10 install` 后再 `npx -y npm@10 ci --dry-run` 验证；只信 npm@10 的 dry-run 结果，npm 11 的通过不代表 CI 通过。

### 11.11 Cloudflare Pages 部署失败: 单文件 ≥ 25 MiB

**现象**: `wrangler pages deploy` 报 `Error: Pages only supports files up to 25 MiB in size — data/page-content.json is 27 MiB`。

**原因**: 生成脚本曾把全量 15 语言内容 JSON (27 MiB) 写入 `public/data/`，Astro 会拷贝进 `dist/` 上传。该文件只被构建期脚本消费、无运行时 fetch，不该进 public/。

**修复**: 大 JSON 只写 `src/i18n/generated/` (gitignored, 构建期读取)，绝不写 `public/`；`site-*` 键拆到 `site-data.ts` (2.2 MiB)，`content-v2*` 键排除 (由 `src/data/content-v2.ts` 直接读 YAML)。

### 11.6 PowerShell 编码问题 (TROUBLESHOOTING.md §5.2)

PowerShell 5.1 默认使用 ANSI 编码，会破坏 UTF-8 多字节字符。

```powershell
# ❌ 错误 — 破坏 UTF-8
Set-Content -Path file.astro -Value $newContent

# ✅ 正确 — 保留 UTF-8
[System.IO.File]::WriteAllText($Path, $content, [System.Text.UTF8Encoding]::new($false))
```

### 11.7 `&rarr;` HTML 实体污染 (TROUBLESHOOTING.md §5.5)

不要在源文件中使用 HTML 实体 `&rarr;`，使用字面 Unicode 箭头 `→`。在 Astro 模板、YAML 文件或组件 props 中，`&rarr;` 经常被双重转义为 `&amp;rarr;`。

### 11.8 编码铁律 (TROUBLESHOOTING.md §3.3)

| #   | 规则               | 原因                                    |
| --- | ------------------ | --------------------------------------- |
| 1   | **UTF-8 无 BOM**   | BOM 导致 YAML 解析错误                  |
| 2   | **只用目标语言**   | 不要在欧洲语言文件中包含中文/日文/韩文  |
| 3   | **不要中转翻译**   | 英语→法语 直接翻译，不要 英语→中文→法语 |
| 4   | **正确 Unicode**   | 使用正确的 Unicode 码点，不要双重编码   |
| 5   | **CJK 文件**       | 确保包含有效的原生字符                  |
| 6   | **不要 AI 重编码** | 验证 AI 输出是正确的 UTF-8              |
| 7   | **修改后验证**     | 运行 `node i18n-tool.cjs check`         |
| 8   | **YAML 有效性**    | 确保引号闭合、缩进一致                  |
| 9   | **默认英语**       | 先写英语内容，再翻译                    |
| 10  | **不要 .bak 文件** | 提交前清理备份文件                      |

### 11.9 导航项显示英文而非翻译文本

**原因**: 新导航项添加到了 `navigation.yaml`，但 `navTextMap` 或 `i18n-config.json` 未同步更新。

**完整修复流程**:

1. 在 `Header.astro` / `Footer.astro` 的 `navTextMap` 中添加 text → 翻译键映射
2. 在 `public/data/i18n-config.json` 中为所有 15 语言添加翻译键值对
3. 运行 `node scripts/_gen-uiall.cjs` 重新生成 UI .ts 文件
4. 运行 `npm run build` 验证

**避免方法**:

- 添加新导航项后检查 `navTextMap` 是否包含新 text 值
- 检查 `i18n-config.json` 是否包含新翻译键
- 验证中文/日文等非英语页面导航显示

### 11.11 页面 404 — 根级页面存在但 `/{lang}/` 路由缺失

**(历史记录 — `solutions-*` 路由已在 2026 泳池转型中全部下线，本节仅作排查模式参考)**

**场景**: 根级页面 `/solutions-fishing-boat-solutions` 正常访问 (200)，但导航指向 `/{lang}/solutions-fishing-boat-solutions` 返回 404。

**根因**: 两层路由缺失：

| 层级                  | 问题                                                                                                     | 说明                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1. 根级 `.astro` 文件 | 4 个解决方案页面（fishing, marine-tourism, rescue, yacht-tender）缺少 `src/pages/solutions-*.astro` 文件 | 只有 diving 页面存在根级文件                                                                          |
| 2. 本地化重定向页面   | 5 个解决方案页面均缺少 `src/pages/[lang]/solutions-*.astro` 文件                                         | 导航生成 `/{lang}/solutions-*` 链接，但本地化内容在 `[lang]/solutions/*` 路径（无 `solutions-` 前缀） |

**修复方法**:

1. 创建根级 `.astro` 页面（加入 `functions/_middleware.ts` 的 `I18N_EXCLUDED` 列表）
2. 创建 `[lang]/solutions-*.astro` 页面，使用 `<meta http-equiv="refresh">` 重定向到实际的 `[lang]/solutions/*` 页面
3. 构建验证：`npm run build` 后检查 `dist/` 中是否生成对应的 `index.html`

**验证命令**:

```bash
curl -sL -o /dev/null -w "%{http_code}" https://felizbay.com/en/solutions-fishing-boat-solutions/
# 期望: 200 (跟随重定向到 /en/solutions/fishing-boat-solutions/)
```

**避免方法**:

- 新建页面时同步创建根级页面和 `[lang]/` 下的重定向页面
- 修改导航链接路径时确认对应的 Astro 路由是否存在
- 构建后检查 `dist/` 目录下是否包含所有预期的路径

### 11.13 乱码问题 (U+FFFD / garbled text)

**现象**: 页面显示 `�` (U+FFFD 替换字符) 或中文/特殊字符显示为乱码。

**原因**:

1. Keystatic/GitHub 内容源文件的 UTF-8 编码在传输或存储过程中损坏
2. Powershell 的 `Set-Content` 默认使用 ANSI 编码，破坏 UTF-8 多字节字符
3. 过于激进的清理脚本（如 `replace(/[^\x00-\x7F]/g, '')` 或 `replace(/\(\s*\)/g, '')`）误删合法代码

**修复方法（靶向修复，不要一刀切）**:

```bash
# ✅ 正确：只替换 U+FFFD 替换字符
node -e "fs.writeFileSync('file.astro', fs.readFileSync('file.astro','utf8').replace(/\uFFFD/g,' '), 'utf8')"
```

```bash
# ❌ 错误：删除所有非 ASCII 字符 — 会破坏：
#   - © · → × ⚠️ 🔍  等合法符号
#   - é ç ñ ê 等法语/西班牙语重音字符
#   - 中文 UI 描述（CMS 面板双语标签）
#   - 方法调用如 .toString() .trim() 中的 ()
```

**需要保留的合法非 ASCII 内容**:

| 类别         | 示例                   | 所在文件                             |
| ------------ | ---------------------- | ------------------------------------ |
| 版权/商标    | `©`, `®`, `™`          | branding.astro                       |
| 标点符号     | `·`, `→`, `×`          | branding, navigation, link-refactor  |
| 警告符号     | `⚠️`                   | navigation.astro                     |
| Emoji        | `🔍`                   | index.astro                          |
| 重音字符     | `é`, `ç`, `ñ`, `ê`     | countries.astro (Français, Español)  |
| 中文 UI 标签 | `编辑站点名称`、`品牌` | branding.astro, seo.astro (双语 CMS) |

**避免方法**:

- 始终使用 `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))` 而不是 `Set-Content`
- 清理脚本中只对 `\uFFFD` 做替换，不碰其他字符
- 修改后运行 `git diff` 检查是否有意外删除的代码行
- 在 CI 中运行 `astro check` 确保 0 错误

### 11.14 readTokenFromCookies 解密失败导致 Bad credentials

**现象**: 在后台成功保存 GitHub Token 后，页面仍然显示 `Failed to read: Bad credentials`。

**原因**: Worker (`/api/admin/save-token`) 将 token 以**明文**（URL-encoded）存入 cookie `ks-gh-token`，但 Astro 前端的 `readTokenFromCookies()` 始终尝试用 AES-256-GCM `decryptToken()` 解密。解密失败返回 `null` → `GitHubClient('')` 发送空 token → GitHub 返回 "Bad credentials"。

**修复**: `readTokenFromCookies` 先尝试解密，失败则回退读取原始值：

```ts
export function readTokenFromCookies(cookies): string | null {
  const raw = cookies.get('ks-gh-token')?.value;
  if (!raw) return null;
  const decrypted = decryptToken(raw); // 尝试解密（Node.js saveTokenCookie 存的是加密格式）
  if (decrypted) return decrypted;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  } // 回退原始值（Worker 存的是明文）
}
```

**避免方法**:

- 确保 Worker 和 Astro 前端使用一致的 token 存储格式
- 如果使用两种存储路径（Worker 存明文、Node.js 存加密），`readTokenFromCookies` 必须兼容两种格式

### 11.15 esbuild Unexpected "t" — import/export 顺序

**现象**: 构建时 `esbuild` 报错 `Unexpected "t"`，指向 `export const prerender = true;`。

**原因**: esbuild 要求静态 `import` 声明必须出现在任何 `export` 之前。Keystatic 页面将 `export const prerender` 放在了 `import` 之前。

```text
---
<!-- ❌ 错误：export 在 import 之前 -->
export const prerender = true;
import AdminLayout from '~/layouts/AdminLayout.astro';

<!-- ✅ 正确：import 必须在 export 之前 -->
import AdminLayout from '~/layouts/AdminLayout.astro';
export const prerender = true;
---
```

**修复**: 将 42 个 keystatic 页面的 `import` 语句移到 `export` 之前。

**避免方法**:

- Astro frontmatter 中始终先写 `import`，再写 `export`
- 提交前运行 `astro build` 或 `astro check` 验证

### 11.16 登录重定向循环

**现象**: 登录成功后跳转到 `/keystatic` 页面立即又跳回 `/login`。

**原因**:

1. 所有 42 个 admin 页面的 frontmatter 调用 `Astro.redirect('/login')`，构建时 `Astro.cookies.get()` 返回 `undefined` → session 为 `null` → 触发重定向（构建时无意义，但运行时逻辑错误）
2. `ks-admin-session` cookie 设置了 `HttpOnly`，前端 `document.cookie` 无法读取

**修复**:

1. 移除所有 admin 页面的 `Astro.redirect('/login')`，改用 `AdminLayout` 的 client-side 脚本检查
2. Worker 登录时额外设置一个非 HttpOnly 的 companion cookie `ks-auth=1`
3. `AdminLayout.astro` 的 `<script is:inline>` 检查 `document.cookie.indexOf('ks-auth=')`：

```js
(function () {
  if (document.cookie.indexOf('ks-auth=') === -1 && window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
})();
```

**避免方法**:

- Admin 页面不要使用 `Astro.redirect('/login')`（构建时运行，cookie 不可用）
- 使用 client-side cookie 检查 + companion cookie 方案
- 登录 cookie 同时设置 HttpOnly（安全）和非 HttpOnly（前端可用）两个版本

### 11.12 价格信息意外显示

**要求**: 产品页面上不允许显示价格 (B2B 要求)。

**已移除**:

- 所有产品详情页的价格显示
- 所有产品对比页的"价格"比较行
- 产品卡片上的价格徽章
- AI 对话中的价格引用文本
- JSON-LD Schema 中的 `offers.price` 字段

**如果将来要添加价格显示**: 需要在 `src/data/products.ts` 添加价格字段, 并在产品页面模板中对应渲染。

### 11.17 YAML.stringify 全文件重写导致大面积 diff

**现象**: 用 `yaml` 包 `parse` → 改一个值 → `stringify` 回写后, 单文件 diff 达 136-162 行, git 历史被无关的折行/引号风格重排污染。

**原因**: `YAML.stringify` 按 lineWidth 重新折行并重选引号风格, 与仓库手工维护的原始 YAML 排版不一致。

**正确做法**: 对源 YAML 做引号感知的**原始文本靶向替换** (`tools/i18n-apply.mjs` 即此实现), 每次替换后 `YAML.parse` 重读并 deep-equal 校验语义, 落盘保持最小 diff。验收标准: `git diff --stat` 的 +N/−N 恰好等于替换条数。

### 11.18 YAML plain scalar 引号规则 (YAMLParseError: Unexpected alias)

**现象**: 写入以 `*` 或 `**` 开头的值 (如 `**Heavy-Duty**` 翻译) 后, 构建报 `YAMLParseError: Unexpected alias`。

**原因**: YAML 中 `*` 开头的 plain scalar 被解析为别名引用 (alias)。

**规则** (`tools/yaml-set.mjs` 的 `plainSafe()` 已内置):

| 值的特征                  | 存储形式          |
| ------------------------- | ----------------- |
| 安全的 plain scalar       | 原样              |
| 以 `*` / `&` 开头或含 `'` | 单引号包裹        |
| 含 `"` 或反斜杠           | 双引号包裹 + 转义 |
| 以 `:` 结尾或含 ` #`      | 引号包裹          |

### 11.19 git push TLS 连接被重置

**现象**: `git push origin main` 报 `OpenSSL SSL_read: Connection was reset` 或无法连接 github.com。

**修复**:

```bash
ipconfig /flushdns                            # GitHub DNS 解析经常劣化, 先刷新
git -c http.version=HTTP/1.1 push origin main # 强制 HTTP/1.1 绕开 HTTP/2 帧错误
```

### 11.20 PowerShell/Node 环境陷阱 (Windows)

| 陷阱                                   | 后果                 | 正确做法                                                     |
| -------------------------------------- | -------------------- | ------------------------------------------------------------ |
| `Get-Content`/`Set-Content` 读写源文件 | 非 ASCII 变 mojibake | 只用编辑工具或 Node 脚本 (`fs.readFileSync`/`writeFileSync`) |
| 路径含 `[lang]` 字面量                 | 被当通配符解析报错   | 一律 `-LiteralPath`                                          |
| `node -e "..."` 内嵌引号/撇号          | 解析失败             | 写成 .mjs 文件再执行                                         |
| 控制台输出非 ASCII                     | 显示乱码但内容正常   | 以 `git diff` / 文件内容为准, 勿信控制台显示                 |

### 11.21 多语言批量替换的三个历史 bug + MT 红线

applier (`tools/i18n-apply.mjs`) 开发中实际踩过的坑:

1. `**` 开头的替换值必须按引号规则包裹 (见 11.18)
2. 替换目标本身已在引号上下文中时, 不能重复加引号: `quoteSingle(t).slice(1, -1)`
3. 保留原文闭合引号: `raw.slice(end)` 而非 `raw.slice(end + 1)`

**机器翻译 (MT) 红线 — 每批替换前必须自查** (全部实际发生过):

- 跨语言词汇泄漏 (瑞典语混入荷兰语 "Tweemotoralternativ")
- 幻觉词 (荷兰语 "Uitruilingsfaulten" 不存在)
- 性/数一致性错误 (sv/pl/ru)
- 航海术语错误 ("korpherrar"→"knapar", "innemende zee"→"over het dek slaande zee")

**遗漏教训**: applier 以 fr 泄漏集为规范序列 — 某语言独有、但 fr 中已是译文的 EN 值不会被匹配 (offshore 的 sv/no items 标题即此情形) → 替换后必须复扫 + 人工核查剩余 EN。

### 11.22 compare 自动页面: 225 个空 noindex 页 (既有站内 bug)

`src/pages/[lang]/compare/[slug].astro` 为 15 对 × 15 语言生成 225 个空页面 (`page=null`, noindex)。这是英文侧既有的站内 bug, 不属于 i18n 泄漏范围 → 扫描 dist 时必须排除 8 个显式 compare 路由 (aluminum-vs-fiberglass 等) 之外的全部 compare 路径。`tools/i18n-endiff.mjs` 已内置该排除逻辑。

### 11.23 机器可读字段保持英文 (审计白名单)

审计扫描时以下字段命中 EN 值属于**设计如此**, 不要"修复": JSON-LD、meta、image alt、href/slug、`.source` 路由、公司名 (`customer`/`company` 键)、邮寄地址、`color`/`badge` class、认证代号 (CE/ISO/USCG)、测试标准 (`standard` 键, 如 ASTM D751)、对比矩阵规格单元格 (`premium` 键)、阀门品牌名 (Halkey-Roberts/Leafield/Boston)、真实地名、产品型号 (如 RIB 600 Patrol)、`custom.yaml` 的 `hero.tagline` ("Felizbay Custom Lab")。完整键名排除表见 `tools/i18n-audit.mjs` 的 `NOISE_KEY`, 字面值排除表见同文件的 `MACHINE_VALUES`。

### 11.24 git push 代理变体：`-c http.proxy` 无效，用环境变量

**现象 (2026-11-05)**: `git -c http.proxy=socks5h://127.0.0.1:10808 push origin main` 连续两次报 `Failed to connect to github.com:443`（报错对象是目标主机，说明 `-c` 代理未生效、走了直连）；同一时刻 `curl.exe` 经同端口代理访问 github.com 返回 200，代理本身正常。

**修复**: 用环境变量方式设置代理后首推即成功：

```powershell
$env:HTTPS_PROXY='socks5h://127.0.0.1:10808'
$env:HTTP_PROXY='socks5h://127.0.0.1:10808'
$env:NO_PROXY='localhost,127.0.0.1'
git push origin main
```

**预防**: 本仓库所有需要出网的命令 (npm / curl.exe / git) 统一走环境变量代理；git 场景不要依赖 `-c http.proxy`（本机 git/libcurl 组合下不稳定，且失败报错具有误导性）。

### 11.25 新增 .md 文件未过全仓 prettier 检查 → CI Lint 步骤失败

**现象 (2026-11-14)**: 提交 `docs/news-drafts/*.md`（3 篇新闻稿草稿）后 CI "Lint + typecheck + prettier + i18n" 步骤失败；日志中 prettier 输出 `[warn] docs/news-drafts/2026-11-14-*.md`。此前本地只对 `TECH.md` 单独跑过 `npx prettier --write`，漏掉了同批提交的新文件。

**修复**: `npx prettier --write "docs/news-drafts/*.md"` 后追加提交，CI 恢复绿。

**预防**:

- 提交任何新增/修改的 `.md` 文件（TECH.md、docs/ 草稿、TROUBLESHOOTING 等）前，跑**全仓**检查而非逐文件：`npx prettier --check .`（或直接 `npm run check`，它包含 prettier 检查 + astro check + ESLint）
- CI 的 prettier 门禁作用于整个仓库（`docs/` 也在扫描范围内），"只改文档不碰代码" 的提交同样会被拦下
- 一次性提交多个新文件时，格式化命令要覆盖**整批**文件，不要只处理记得的那一个

### 11.26 图标名不在 tabler 集合中 → 页面图标静默缺失（无构建报错）

**现象 (2026-11-14 发现)**: `compliance.astro` 使用 `icon: 'tabler:blueprint'`，但 tabler 图标集没有 `blueprint` 图标 — `gen-icon-svgs.cjs` 生成器把不可解析的名字计入 "skipped N broken" 警告并跳过（构建不失败），页面该栏目图标**从未渲染**（自 57710ce 部署起线上缺失约 1 天）。

**根因**: 图标名是自由字符串，无编译期校验；生成器的 broken 列表只进构建日志（`Generated 100 icon SVGs; skipped 2 broken: ...`），不阻断构建。

**修复**: 换用真实存在的图标（本例 `tabler:blueprint` → `tabler:file-check`），重新构建后生成器自动清理 `icon-valid-names.ts` 中的死条目。

**预防**:

- 写图标名前先验证存在：`node -e "const t=require('@iconify-json/tabler/icons.json');console.log(!!t.icons['<name>']||!!t.aliases?.['<name>'])"`
- 构建日志中 `skipped N broken` **非零即需排查** — 排除 `seo.astro` 动态拼接产生的 `tabler:brand-` 伪条目后，任何 broken 都意味着线上有静默缺失的图标
- 部署后抽查：目标栏目标题前 700 字符内应存在 `<svg`（参见 prod-check 脚本的图标断言模式）

### 11.27 代理不稳时 git push 走 HTTP/2 连续被重置，强制 `http.version=HTTP/1.1` 一次通过

**现象 (2026-11-14)**: 推送含 4 份 PDF（约 3.7 MB）的提交 `2463990` 时，经 `http://127.0.0.1:10810` 代理连续 18 次失败，两类报错交替：`Recv failure: Connection was reset` / `Failed to connect to github.com:443 after 21s`，以及大包上传阶段 `error: RPC failed; curl 55 Send failure: Connection was reset` + `send-pack: unexpected disconnect while reading sideband packet`。同一时段 `ls-remote` 等小请求正常，`curl` 经代理访问 github.com 能拿到 200（30 秒、慢）。

**陷阱 1（误导性输出）**: 一次 RPC 失败后 push 输出末尾出现 `Everything up-to-date`——并非推送成功；`git ls-remote origin refs/heads/main` 确认远端 ref 未动。RPC 阶段失败一律以 ls-remote 复核为准。

**修复**: 强制 HTTP/1.1（规避代理链路上的 HTTP/2 多路复用重置），首推即成功：

```powershell
git -c http.proxy=http://127.0.0.1:10810 -c http.version=HTTP/1.1 `
  -c http.postBuffer=15728640 -C <repo> push origin main
```

**陷阱 2（本地验证假阴性）**: PowerShell 捕获 `curl.exe` 输出得到的是**行数组**（`string[]`），对其调用 `.Contains('marker')` 是整行精确匹配而非子串查找——页面明明含 "25.4 PSI" 却报 False。验证前必须先 `-join "`n"` 拼回字符串；`-match`对数组是逐元素正则，行为与`.Contains()` 不一致，混用会得出矛盾结论。

**预防**:

- 大文件提交（PDF/图片批次）推送失败且报 `curl 55`/`Recv failure` 时，直接加 `http.version=HTTP/1.1` + 大 `http.postBuffer` 重试，不要空转重试同一命令
- push 报 RPC 失败后用 `ls-remote` 复核远端 ref，不要相信输出中的 `Everything up-to-date`
- PowerShell 验证 HTTP 响应内容：`(curl.exe ...) -join "`n"` 后再做子串断言

---

## 12. 编辑指南与红线

### 12.1 翻译相关

- **✅ 使用**: `getUiForLang(lang)` 从 `~/i18n/generated/ui-all` 导入
- **❌ 禁止**: 从 `~/i18n/config` 导入 `ui` 并使用 `(ui as any)`
- **❌ 禁止**: 使用 `(ui as any)[key]` 或 `(ui)[key]` 模式
- **✅ 推荐模式**: `const t = (key: string) => getUiForLang(locale)?.[key] || key;`

### 12.2 产品相关

- 产品结构化数据在 `src/data/products.ts` 修改
- 产品多语言文本在 `src/data/product-texts.ts` 修改
- Tags 渲染必须使用安全展开, 不能直接渲染对象
- 不要在产品页面上添加价格信息

### 12.3 导航项修改红线

添加或修改导航项时，必须同步更新以下**六处**:

| #   | 文件                                  | 修改内容                                                 |
| --- | ------------------------------------- | -------------------------------------------------------- |
| 1   | `src/data/site/navigation.yaml`       | 添加/修改导航结构和英文 text                             |
| 2   | `src/components/widgets/Header.astro` | 在 `navTextMap` 添加 text → 翻译键映射                   |
| 3   | `src/components/widgets/Footer.astro` | 同上，在 `navTextMap` 添加映射                           |
| 4   | `public/data/i18n-config.json`        | 为所有 15 语言添加翻译键和翻译文本                       |
| 5   | `node scripts/_gen-uiall.cjs`         | 重新生成 UI .ts 文件（修改 i18n-config.json 后必须运行） |
| 6   | `src/i18n/routing.ts`                 | 如果新页面在 `[lang]/` 下，添加到 `LOCALIZED_ROUTES`     |
| 7   | `src/lib/geo-seo/intent.ts`           | 为新页面添加 `aboutMap` + `intentRules` 条目             |

**❌ 不要**只修改 `navigation.yaml` 或本地化 YAML 文件（如 `navigation.zh.yaml`）——渲染系统不使用它们进行翻译。

**✅ 验证方法**: `git grep 'New Text'` 检查是否在所有必要文件中出现。新页面路径应同时在 routing.ts 和 intent.ts 中注册。

### 12.4 文件编码

- 所有源文件必须使用 **UTF-8 without BOM**
- 修改包含中文/非 ASCII 字符的文件后, 运行 `python scripts/check-encoding.py`
- 如果发现乱码, 运行 `python scripts/fix-garbled.py`

### 12.4 Worker 限制

- 每个 Worker 的 JS 编译后必须 **< 3 MB**
- 不要在 Worker 中 `import` Astro 项目 `src/` 目录的文件
- Worker 使用独立的 `wrangler.toml` 配置

### 12.5 R2 资产

- 静态图片/文件上传到 R2 后, 通过 `https://assets.felizbay.com/...` 访问
- 上传命令: `node scripts/fast-upload-r2.mjs`
- `functions/_middleware.ts` 自动将 `/images/*` 和 `/files/*` 重定向到 R2

### 12.6 构建与部署

- 修改前务必运行 `npm run build` 确认构建成功
- 构建成功后部署: `npx wrangler pages deploy dist/`
- 如果修改了 Worker, 单独部署: `npm run deploy:worker-<name>`
- 如果修改了资产文件, 上传 R2: `node scripts/fast-upload-r2.mjs`

### 12.7 修改后验证清单 (参考 TROUBLESHOOTING.md §6)

每次修改后，始终验证：

1. `node i18n-tool.cjs check` 通过
2. `npx esbuild src/i18n/config.ts --bundle --format=esm --outfile=NUL` 通过
3. `node scripts/geo-build.mjs` 通过
4. `npm run build` 构建成功
5. 视觉检查：主页、博客、暗模式、移动菜单、联系表单

### 12.8 添加新内容清单 (参考 TROUBLESHOOTING.md §8)

**新产品:**

1. 在 `src/data/products.ts` 添加产品数据
2. 在 `src/content/products/{slug}.mdx` 创建 MDX
3. 在 `src/data/product-texts.ts` 添加翻译
4. → 自动生成：产品页面、`/llms/products/{slug}`、JSON-LD、llms.txt

**新本地化页面 (15语言):**

1. 在 `src/pages/[lang]/{slug}.astro` 创建页面
2. 在 `src/i18n/config.ts` 添加翻译键
3. 在 `src/data/site/sections.ts` 添加条目
4. 在 `src/lib/geo-seo/intent.ts` 添加意图规则
5. → 自动生成：HTML 页面、llms.txt、llms-full.txt、站点地图

**新 B2B 页面:**

1. 在 `src/pages/{slug}.astro` 创建页面（根级，英语）
2. 在 `src/data/standalone-pages.ts` 添加元数据
3. 在 `src/data/site/sections.ts` 添加条目
4. → 自动生成：HTML 页面、`/llms/pages/{slug}`、llms.txt、站点地图

**新多语言页面 (通用模式, Solutions/Industries 时代已退役):**

> 2026-10-26 起船时代的 `solutions-*` / `industries-*` 数据驱动页面模式已随路由全部下线。新增多语言页面请参照 `[lang]/faq.astro` 的现行模式（页面级 YAML/TS 数据 + `getStaticPaths` × 37 语言）。

1. 在 `src/data/pages/{slug}.yaml` 创建 YAML 数据（hero, benefits, cta）
2. 在 `src/pages/{slug}.astro` 创建根级页面（使用 `getPageContent('en', '{slug}')`）
3. 在 `src/pages/[lang]/{slug}.astro` 创建本地化页面（`getStaticPaths`）
4. 在 `src/lib/geo-seo/intent.ts` 添加 `aboutMap` + `intentRules` 条目
5. 在 `src/data/site/navigation.yaml` 添加导航项
6. → 自动构建: 37 语言 HTML 页面, JSON-LD, ai-intent meta, llms.txt

### 12.9 代码检查

```bash
npm run check          # 全部检查 (astro + eslint + prettier + i18n)
npm run check:astro    # 仅 astro check
npm run check:eslint   # 仅 eslint
npm run check:prettier # 仅 prettier
npm run check:i18n     # 仅 i18n 翻译检查
```

---

## 13. 附录: 关键文件引用

| 文件                                     | 用途                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| `src/i18n/generated/ui-all.ts`           | `getUiForLang()` 函数 (翻译入口)                                       |
| `src/i18n/config.ts`                     | `setLang()`, `defaultLang`, 语言列表                                   |
| `src/i18n/utils.ts`                      | `getLangFromUrl()`, 路径处理                                           |
| `src/i18n/page-content.ts`               | `getPageContent()` 页面内容                                            |
| `src/i18n/generated/site-data.ts`        | `site-*` 键构建产物 (2.2 MiB, [lang]/ 页面直接 import)                 |
| `src/i18n/generated/pages/*.ts`          | 每页一个 TS 模块 (~110 个, 构建期生成)                                 |
| `scripts/generate-data-json.mjs`         | i18n 构建数据生成 (page-content.json + site-data.ts, content-v2* 排除) |
| `scripts/patch-worker.mjs`               | ⚠️ 历史遗留 (server 模式子域路由), static 下不执行, 勿改勿用           |
| `src/data/products.ts`                   | 产品结构化数据                                                         |
| `src/data/product-texts.ts`              | 产品多语言文本                                                         |
| `src/layouts/Layout.astro`               | 主布局 (调用 setLang)                                                  |
| `src/components/widgets/Header.astro`    | 导航栏 (getUiForLang)                                                  |
| `src/components/widgets/Footer.astro`    | 页脚 (getUiForLang)                                                    |
| `src/pages/[lang]/products/[slug].astro` | 多语言产品详情                                                         |
| `src/pages/products/[slug].astro`        | 英语产品详情                                                           |
| `functions/_middleware.ts`               | Pages Functions 中间件                                                 |
| `src/middleware.ts`                      | Astro 中间件                                                           |
| `wrangler.toml`                          | R2 bucket 声明                                                         |
| `src/i18n/routing.ts`                    | 共享路由模块 (`LOCALIZED_ROUTES`, `localizeHref()`, `entityForHref()`) |
| `src/utils/images.ts`                    | 图片处理 (`adaptOpenGraphImages()` — 远程 URL 跳过 `getImage()`)       |
| `scripts/_gen-uiall.cjs`                 | UI 翻译生成脚本                                                        |
| `scripts/_gen-pages.cjs`                 | 页面内容 TS 模块生成脚本                                               |
| `scripts/check-translations.mjs`         | 翻译检查脚本                                                           |
| `src/lib/token-store.ts`                 | GitHub Token 的 cookie 加密/解密/读取                                  |
| `src/lib/auth.ts`                        | legacy HMAC 会话校验 (better-auth 迁移后的兼容回退)                    |
| `src/lib/github.ts`                      | `GitHubClient` 封装 GitHub REST API                                    |
| `src/layouts/AdminLayout.astro`          | 后台布局：侧边栏导航 + client-side 登录检查                            |
| `workers/admin-worker/index.ts`          | 后台 Worker：better-auth、GitHub 代理、Token 保存、D1 查询             |
| `workers/shared/auth.ts`                 | better-auth 共享配置 (插件/角色/OAuth 提供商)                          |
| `src/pages/keystatic/`                   | 44 个 CMS 编辑页面 (顶层 29 + 5 个集合子目录)                          |
| `src/data/admin-auth.json`               | ⚠️ legacy 硬编码凭据回退（better-auth 已取代，不建议继续使用）         |

---

## 14. 后台管理系统架构

### 14.1 概述

后台管理系统位于 `/keystatic/*` 路由，提供 CMS 功能（编辑产品、文章、页面、导航等）。系统采用 **静态构建 + Worker API 的混合架构**：

- **前端**: Astro 静态页面 (`output: 'static'`)，所有 admin 页面在构建时预渲染
- **API**: Cloudflare Worker (`felizbay-admin`) 处理认证、GitHub 读写、D1 查询
- **认证**: better-auth（Google OAuth + 邮箱密码，D1 会话，Turnstile 验证码）
- **存储**: 内容读写 GitHub 仓库（REST API，draft 分支编辑 → publish 合并）；提交记录/用户会话存 D1

### 14.2 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                   浏览器 (Browser)                        │
│   /keystatic/*   ←  Astro 静态页面 (预渲染)              │
│   /login         ←  登录页面 (better-auth + Turnstile)   │
│   /api/auth/*    ←  better-auth 端点                     │
│   /api/admin/*   ←  fetch → Worker API                   │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
┌──────────────────┐    ┌──────────────────────────┐
│  Cloudflare Pages │    │  Cloudflare Worker       │
│  dist/ (静态文件)  │    │  felizbay-admin         │
│                   │    │                          │
│  /keystatic/*     │    │  better-auth (D1 会话)   │
│  /login           │    │  /api/admin/list         │
└──────────────────┘    │  /api/admin/read          │
                         │  /api/admin/update        │
                         │  /api/admin/publish       │
                         │  /api/admin/inquiries     │
                         │  /api/admin/refactor/*    │
                         └───────────┬──────────────┘
                                     │
                    ┌────────────────┴───────────────┐
                    ▼                                ▼
        ┌────────────────────────┐      ┌────────────────────┐
        │  GitHub REST API        │      │  D1 (Felizbay-db)  │
        │  api.github.com         │      │  user/session/      │
        │  GET/PUT/POST contents  │      │  account/verification│
        │  POST merges (draft→main)│      │  inquiry (提交记录)  │
        └────────────────────────┘      └────────────────────┘
```

### 14.3 认证流程 (better-auth)

#### 14.3.1 登录

```
用户在 /login 选择 Google OAuth 或输入邮箱+密码（+ Turnstile 验证码）
  │
  ▼
POST /api/auth/* (better-auth, 由 admin-worker 提供)
  │
  ├─ Google OAuth 回调 → 创建/查找用户 → 建立会话
  ├─ 邮箱+密码 → 校验密码 → 建立会话
  │
  ├─ 会话存储: D1 session 表 (drizzleAdapter)
  ├─ 会话 cookie: csr_session (HttpOnly, Secure)
  ├─ 角色判定: isAdminEmail(email, ADMIN_EMAILS) → admin / user
  │   (admin 角色通过 better-auth admin 插件授予)
  │
  └─ 成功后前端跳转 /keystatic
```

#### 14.3.2 认证检查

- **构建时**: `Astro.cookies.get()` 返回空 → 所有 admin 页面预渲染为空壳
- **运行时 (浏览器)**:
  - `AdminLayout.astro` 的 inline script 检查登录状态（client-side），未登录 → `window.location.replace('/login')`
  - Worker API 请求通过 better-auth cookie 认证；`workers/shared/assert-admin.ts` 校验 admin 角色
  - 内容编辑目标分支为 `draft`，发布时 `POST /api/admin/publish` 合并到 `main`

#### 14.3.3 登出

```
GET /api/auth/sign-out (better-auth)
  → 删除 D1 session 行 + 清除 csr_session cookie
```

### 14.4 GitHub Token 管理

#### 14.4.1 Token 保存流程

```
用户在 /keystatic/github-token 输入 PAT → 提交
  │
  ├─ 1. POST /api/admin/save-token { token }
  │     Worker 验证格式 (ghp_ 或 github_pat_ 开头)
  │     Worker 设置 cookie: ks-gh-token={encodeURIComponent(token)}
  │     返回 { success: true }
  │
  ├─ 2. 前端 JS 额外保存到 localStorage: ks-gh-token
  │
  └─ 3. 页面重定向到 /keystatic
```

#### 14.4.2 Token 读取流程

```
Astro 页面 frontmatter → readTokenFromCookies(Astro.cookies)
  │
  ├─ 1. 读取 cookie 'ks-gh-token' 的原始值
  ├─ 2. 尝试 AES-256-GCM 解密（兼容 Node.js saveTokenCookie 加密格式）
  ├─ 3. 解密失败 → 尝试 decodeURIComponent（兼容 Worker 明文格式）
  └─ 4. 返回 token 字符串 或 null
```

#### 14.4.3 两套存储路径

| 路径           | 设置方式                                | 格式                         | 适用场景             |
| -------------- | --------------------------------------- | ---------------------------- | -------------------- |
| **Worker API** | `POST /api/admin/save-token`            | 明文 + `encodeURIComponent`  | 浏览器端操作         |
| **Node.js**    | `saveTokenCookie()` in `token-store.ts` | AES-256-GCM 加密 + base64url | 构建时/SSR（未使用） |

> ⚠️ `readTokenFromCookies()` 必须兼容两种格式。

### 14.5 GitHub API 调用

`GitHubClient` (`src/lib/github.ts`) 封装所有 GitHub REST API 调用：

```
GitHubClient(token)
  │
  ├─ verifyToken()        → GET /user               (验证 token 有效性)
  ├─ listFiles(dirPath)   → GET /repos/*/contents/*  (列出目录文件)
  ├─ readFile(filePath)   → GET /repos/*/contents/*  (读取文件内容)
  ├─ createFile(...)      → PUT /repos/*/contents/*  (创建文件)
  ├─ updateFile(...)      → PUT /repos/*/contents/*  (更新文件)
  ├─ deleteFile(...)      → DELETE /repos/*/contents/* (删除文件)
  └─ getRecursiveTree()   → GET /repos/*/git/trees/* (获取完整目录树)
```

**工作原理**:

- 每个 admin 页面在 frontmatter 中创建 `GitHubClient(token)` 实例
- 页面使用 `readFile()` 从 GitHub 加载当前内容
- 用户编辑后，表单通过 fetch POST 到 Worker `/api/admin/update`
- Worker 使用 `GITHUB_TOKEN` (环境变量) 将更新提交到 GitHub

### 14.6 页面结构

#### 14.6.1 Admin 页面列表 (44 个页面)

```
src/pages/keystatic/
├── index.astro                     # Dashboard
├── about.astro                     # About 页面内容 (15 语言)
├── branding.astro                  # 品牌/Logo/联系信息 (15 语言)
├── categories.astro                # 产品分类 (15 语言)
├── contact-form-text.astro         # 联系表单文字配置 (15 语言)
├── content-v2.astro                # 内容 V2 库 (15 语言)
├── countries.astro                 # 国家/地区配置 (15 语言)
├── evidence.astro                  # 案例证据 (15 语言)
├── faqs.astro                      # FAQ (15 语言)
├── github-token.astro              # GitHub Token 管理
├── hero-images.astro               # Hero 图片 (15 语言)
├── inquiries.astro                 # 联系表单提交记录 (D1, /api/admin/inquiries)
├── languages.astro                 # 语言管理
├── learning-center.astro           # 学习中心 (15 语言)
├── link-refactor.astro             # 链接重构工具 (URL/名称批量改名)
├── navigation.astro                # 导航管理 (15 语言, 变更检测 → 重命名横幅)
├── news.astro                      # 新闻撰写 (写入 D1 news 表)
├── product-visuals.astro           # 产品图片映射 (15 语言)
├── proof-points.astro              # 营销数据点 (15 语言)
├── research.astro                  # 研究内容 (15 语言)
├── seo.astro                       # SEO 设置 (15 语言)
├── tech-cards.astro                # 技术卡片 (15 语言)
├── testimonials.astro              # 客户推荐 (15 语言)
├── top-guides.astro                # 顶部指南 (15 语言)
├── trust-badges.astro              # 信任徽章 (15 语言)
├── trust-bar.astro                 # 信任栏 (15 语言)
├── use-cases.astro                 # 用例 (15 语言)
├── users.astro                     # 用户管理 (better-auth admin 插件)
├── validate-links.astro            # 链接验证 (只读全站 href 扫描)
│
├── posts/
│   ├── index.astro                 # 文章列表
│   ├── new.astro                   # 新建文章
│   └── [slug].astro                # 编辑文章 (15 语言)
├── products/
│   ├── index.astro                 # 产品列表
│   ├── new.astro                   # 新建产品
│   └── [slug].astro                # 编辑产品 (15 语言, ProductForm 内嵌语言选择)
├── pages/
│   ├── index.astro                 # 页面列表
│   ├── new.astro                   # 新建页面
│   └── [slug].astro                # 编辑页面 (15 语言)
├── case-use/
│   ├── index.astro                 # 案例列表
│   ├── new.astro                   # 新建案例
│   └── [slug].astro                # 编辑案例 (15 语言)
├── technology/
│   ├── index.astro                 # 技术文章列表
│   ├── new.astro                   # 新建技术文章
│   └── [slug].astro                # 编辑技术文章 (15 语言)
```

> 标记 `(15 语言)` 的页面支持全 15 种语言的翻译编辑。语言通过 `?locale=` 查询参数切换。

#### 14.6.2 i18n-admin 工具库

`src/lib/i18n-admin.ts` 提供多语言编辑所需的常量和路径工具：

```typescript
export const ADMIN_LOCALES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  it: 'Italiano',
  ru: 'Русский',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  el: 'Ελληνικά',
  fi: 'Suomi',
  da: 'Dansk',
};
export const ADMIN_LOCALE_CODES = Object.keys(ADMIN_LOCALES);
export function siteFileForLocale(basePath: string, locale: string): string;
export function pageFileForLocale(slug: string, file: string, locale: string): string;
export function contentFileForLocale(basePath: string, locale: string): string;
```

**文件命名约定：**

- 站点内容：`about.yaml` → `about.zh.yaml` (后缀式)
- 集合条目：`foo.md` → `foo.zh.md` (后缀式)
- 静态页面：`privacy.yaml` → `zh/privacy.yaml` (子目录式)

#### 14.6.3 每个页面的标准结构 (15 语言版)

```astro
---
// 1. import
import AdminLayout from '~/layouts/AdminLayout.astro';
import { ADMIN_LOCALES, ADMIN_LOCALE_CODES, siteFileForLocale } from '~/lib/i18n-admin';
import { verifySessionToken } from '~/lib/auth';
import { readTokenFromCookies } from '~/lib/token-store';
import { GitHubClient, getRepoInfo } from '~/lib/github';
export const prerender = true;

// 2. 区域设置检测
const locale = (Astro.url.searchParams.get('locale') || 'en').toLowerCase();
const isDefault = locale === 'en';
const file = siteFileForLocale('src/data/site/about.yaml', locale);

// 3. 加载内容（含英文回退）
const session = Astro.cookies.get('ks-admin-session')?.value;
const verified = session ? verifySessionToken(session) : null;
const token = readTokenFromCookies(Astro.cookies);
let data = {};
let sha = '';
if (token) {
  try {
    const client = new GitHubClient(token);
    let f;
    try {
      f = await client.readFile(file, 'draft');
    } catch {
      try {
        f = await client.readFile(file);
      } catch {
        if (!isDefault) {
          f = await client.readFile('src/data/site/about.yaml');
        }
      }
    }
    if (f) {
      data = load(f.content);
      sha = f.sha;
    }
  } catch (err) {
    loadError = err.message;
  }
}
---

<AdminLayout title="..." active="...">
  <!-- 4. 语言切换器 + 文件路径 -->
  <div class="flex items-center justify-between gap-4 flex-wrap">
    <h1 class="text-2xl font-semibold">...</h1>
    <select id="locale-select">
      {ADMIN_LOCALE_CODES.map((l) => (
        <option value={l} selected={l === locale}>
          {ADMIN_LOCALES[l]}
        </option>
      ))}
    </select>
  </div>

  <!-- 5. 编辑表单 -->
  <form data-locale={locale}>...</form>

  <script is:inline>
    // 6. 语言切换导航
    document.getElementById('locale-select')?.addEventListener('change', function () {
      var loc = this.value;
      var base = window.location.pathname;
      window.location.href = loc === 'en' ? base : base + '?locale=' + loc;
    });
    // 7. 表单提交逻辑
  </script>
</AdminLayout>
```

> 区域设置文件加载优先级：`draft` 分支 → `main` 分支 → 英文源文件（仅非英文区域设置回退）

### 14.7 Worker API 端点总览

| 端点                        | 方法 | 认证                            | 用途                                 |
| --------------------------- | ---- | ------------------------------- | ------------------------------------ |
| `/api/auth/*`               | ALL  | better-auth                     | 登录/登出/会话 (Google OAuth + 邮箱) |
| `/api/admin/list`           | GET  | better-auth cookie              | 列出目录文件                         |
| `/api/admin/read`           | GET  | better-auth cookie              | 读取文件 (frontmatter/yaml)          |
| `/api/admin/create`         | POST | better-auth cookie              | 创建文件 (draft 分支)                |
| `/api/admin/update`         | POST | better-auth cookie              | 更新文件 (draft 分支, 支持 YAML)     |
| `/api/admin/delete`         | POST | better-auth cookie              | 删除文件                             |
| `/api/admin/publish`        | POST | better-auth cookie + admin 角色 | 合并 draft → main                    |
| `/api/admin/save-token`     | POST | better-auth cookie              | 保存 GitHub Token 到 cookie          |
| `/api/admin/inquiries`      | GET  | better-auth cookie + admin 角色 | 读取 D1 联系提交 (最新 50 条)        |
| `/api/admin/inquiries.csv`  | GET  | better-auth cookie + admin 角色 | 导出全部提交为 CSV                   |
| `/api/admin/refactor/scan`  | POST | better-auth cookie + admin 角色 | 链接重构扫描 (预览 diff)             |
| `/api/admin/refactor/apply` | POST | better-auth cookie + admin 角色 | 链接重构逐文件提交                   |

### 14.8 Cookie 清单

| Cookie 名     | HttpOnly | 用途                                     | 设置者               | 过期           |
| ------------- | -------- | ---------------------------------------- | -------------------- | -------------- |
| `csr_session` | ✅ 是    | better-auth 会话 token (Worker API 认证) | Worker (better-auth) | 30 天 (可配置) |
| `ks-gh-token` | ❌ 否    | GitHub Personal Access Token             | Worker               | 30天           |

> 旧版 `ks-admin-session` (HMAC) 和 `ks-auth` 标记 cookie 已随 better-auth 迁移退役（`src/lib/auth.ts` 保留兼容回退）。

### 14.9 关键依赖关系

```
src/lib/token-store.ts
  ├─ node:crypto (createHash, createCipheriv, createDecipheriv) — AES-256-GCM
  ├─ SESSION_SECRET / KEYSTATIC_SECRET — 加密密钥
  └─ 被所有 keystatic/*.astro 页面引用

workers/shared/auth.ts
  ├─ betterAuth() — 主认证配置 (secret, baseURL, drizzleAdapter(D1))
  ├─ admin 插件 — 用户/会话管理 (ban, impersonate, list)
  ├─ captcha 插件 — Turnstile
  ├─ adminAc (access control) — 角色权限
  └─ socialProviders() — Google / GitHub OAuth

workers/shared/client.ts / schema.ts
  ├─ drizzle ORM + D1 数据库连接
  └─ 表: user, session, account, verification, inquiry, news, rateLimit

workers/shared/assert-admin.ts
  └─ isAdminEmail() + 会话校验 → 403 拦截非管理员请求

workers/admin-worker/index.ts
  ├─ better-auth handler (/api/auth/*)
  ├─ handleAdmin() — 所有 /api/admin/* 路由 (GitHub CRUD + D1 查询 + refactor)
  └─ handleInquiries() — D1 inquiry 读取/CSV 导出

src/layouts/AdminLayout.astro
  ├─ 侧边栏导航 (30+ 入口)
  ├─ 登录检查 (client-side, 跳转 /login)
  ├─ 暗模式 / 移动端支持
  └─ Toast 通知系统
```

### 14.10 公众站点区域设置内容加载

公众站点的非英文页面（`[lang]/*.astro`）通过构建时生成的 JSON 加载区域设置感知的内容：

**页面内容**（`src/data/pages/{locale}/{page}.yaml`）：

- 构建时由 `scripts/generate-data-json.mjs` 处理 → `page-content.json`
- 每页导入 `generated/pages/{name}.ts` → `getPageContent(lang, 'page')`
- 区域设置文件不存在时跳过（不降级到英文）

**站点内容**（`src/data/site/*.yaml`）：

- 构建时同样由 `generate-data-json.mjs` 处理，键为 `{lang}/site-{name}`
- 页面通过 `import { pageContentData } from '~/i18n/generated/site-data'` 访问
- 访问模式：`pageContentData[\`${lang}/site-about\`] || pageContentData['en/site-about'] || {}`
- 区域设置文件不存在时自动降级到英文

**构建管线：**

```
generate-data-json.mjs
  ├─ generateI18nConfig()   → i18n-config.json (UI 字符串, 15 语言)
  ├─ generatePageContent()   → page-content.json (页面 + 站点内容)
  │    ├─ src/data/pages/{locale}/{page}.yaml    → {lang}/{page}
  │    └─ src/data/site/{name}.{locale}.yaml      → {lang}/site-{name}
  └─ writeSiteDataTs()        → site-data.ts (仅 site-* 键)
         ↓
_gen-pages.cjs → generated/pages/{name}.ts (每页一个分片)
_patch-pages.cjs → 自动注入 import/setter 到 [lang]/ 页面
```

**回退行为：** 当 `{lang}/site-about` 在 page-content.json 中不存在时：

1. 检查 `en/site-about`（英文源文件）
2. 如果也不存在，返回 `{}`（空对象）

---

## 15. 多语言批量编辑工具 (tools/)

> **铁律: 对 36 个非英语言副本的任何页面文案增删改, 必须走批量脚本, 禁止手工逐文件编辑。**
> 脚本存放于仓库 `tools/`, 随代码一起提交推送; 用法或结构变更时, 必须同步更新本节 (维护规则见 §15.6)。

### 15.1 工具清单

| 脚本                 | 用途                                          | 用法                                       |
| -------------------- | --------------------------------------------- | ------------------------------------------ |
| `yaml-set.mjs`       | 通用批量 set/delete (spec.json 驱动)          | `node tools/yaml-set.mjs <spec> [--dry]`   |
| `page-seed.mjs`      | EN 页面 YAML 复制到语言目录 (门槛文件/预翻译) | `node tools/page-seed.mjs <lang> <page>…`  |
| `i18n-wordcount.mjs` | 页面字数统计 (SEO 索引阈值校验)               | `node tools/i18n-wordcount.mjs <route...>` |

目录约定:

- `tools/_work/` — 运行产物 (临时 spec), 自带 `.gitignore` 全忽略, 不提交

### 15.2 已退役工作流 (2026-10-26, 历史参考)

船内容清理中删除了 `tools/l10n/` 翻译表目录 (443 个船时代文件) 及 `i18n-audit.mjs` / `i18n-apply.mjs` / `i18n-endiff.mjs` / `i18n-verify-home.mjs` / `ui-seed.mjs`, 原有的「泄漏审计 → 翻译表 → 批量替换」管线随之退役:

```
1. node tools/i18n-audit.mjs <base>.yaml      # 生成泄漏清单 (fr 为规范序列)
2. 人工翻译 → tools/l10n/<base>.<lang>.json
3. node tools/i18n-apply.mjs <base> [--dry]   # 引号感知替换 + 重读校验
4. node tools/i18n-audit.mjs <base>.yaml      # 复扫, 期望 0
```

日常批量编辑改用 `yaml-set.mjs` (§15.3); dist 产物的英文残留可用全仓 `rg` 扫描替代 i18n-endiff。若未来重新接入新语言, 需重建等价的 UI 键注入/泄漏审计工具。

**船内容翻译缓存二次清理 (2026-10-26 第二轮):** `.cache/` 5 个 git 跟踪缓存移除全部残留船词条 — `product-translate-cache.json` 整文件删除 (6,489 条孤儿缓存, 消费脚本 translate-products.mjs 已于第一轮退役, translate-products.yml 零引用); 4 个活跃缓存 (body-components / i18n-translate / page-meta / content-v2-bing) 以词元级检测共删 9,270 条 (首遍 8,936 + 复合词增量 334), 覆盖德语复合词 (Sportboote/Bootstypen/Bootsfender/Bootssicherheit)、RCD 设计类别、救生衣 (life vest/jacket) 选购指南、潜水包船等船时代内容。误报防护: 挪/丹麦语 -kravene/-prøvene/-lovene 词尾、瑞典语 båda、芬兰语 vene (partiovene 等真船词除外已显式匹配)、阿拉伯语 مقاربة 等以负向断言/词元检测排除; 清理后 token 检测器归零, 宽松正则仅剩 9 处已知词形保留项 (kravene 类, 均为现役泳池/B2B 内容)。教训: 简单 `endsWith`/`startsWith` 前后缀匹配对屈折语复合词既漏报 (德语复合词) 又误报 (kravene), 清理多语言缓存必须用词元级检测 + 逐样本人工复核。

### 15.3 yaml-set.mjs

spec.json 驱动的通用批量编辑器, 适合"同一改动跨多语言"的场景 (统一措辞、改标题、删字段):

```json
{
  "base": "home",
  "langs": ["sv", "no"],
  "set": { "hero.tagline": "value" },
  "setPerLang": { "fr": { "hero.title": "Titre" } },
  "delete": ["content_segments.items[2]"],
  "includeEn": true
}
```

安全模型 (v1 设计边界):

- `set`: 旧值必须是该文件内**唯一**字符串叶节点, 否则整文件 ABORT (改用 `setPerLang` 精确定位)
- 不支持新增路径; `delete` 仅限标量叶 (整行删除); flow-style 行安全中止
- 每文件写前 full reparse + JSON deep-equal 对照期望树, 不一致即回滚不落盘
- 结构性块增删 (数组整块、新 section): 复制本脚本引擎写一次性脚本, 用后弃置 (不入 tools/)

### 15.4 维护规则

- **页面结构变更时**: 同步更新受影响的 tools/ 脚本, 并在 TECH.md 对应小节记录变更
- **一次性脚本不入仓库**: 历史累计 ~478 个临时脚本不迁移 — 只有可复用、经实战验证的工具才进 tools/
- **路径定位**: 全部脚本用 repo-relative `import.meta.url` 推导 ROOT, 不硬编码绝对路径
- **代码风格**: `tools/*.mjs` 不在 `.prettierignore` 内, 受 prettier/eslint 约束 — 提交前 `npx prettier --write "tools/*.mjs"` + `npx eslint "tools/*.mjs"`
- **提交纪律**: 数据修复 (yaml) 与工具/文档 (tools/ + TECH.md) 分开提交, 便于回溯

---

## 16. 37 语言架构与上架流程

> 2026-09-23 上线: 站点从 15 语言扩展到 **34 语言** (新增 19: cs,th,hr,tl,hu,ro,sk,bg,sl,sr,ja,ko,tr,id,he,ms,lt,lv,et)。
> 2026-10-16 收敛: 先扩充 6 语言 (kk,vi,uz,uk,az,fa) 至 40, 随后**删除 ja/ko/vi → 37 语言** (en + 36, 见 §16.6)。
> 设计: 新语言**立即可见** — 页面走 EN-fallback 管线渲染, 整语言 noindex (零 SEO 风险), 每语言只种子翻译
> 导航 UI 键 (~84 个) + config 元数据 + 完整翻译的 home.yaml; 深度内容翻译为后续工作 (与 §15 泄漏清零同流程)。

### 16.1 语言注册表触点 (改语言列表必须同步的全部文件)

| 文件                                                               | 作用                                                                                                                                                                                                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/i18n/config.ts`                                               | `languages` map — 驱动全部 `getStaticPaths()` (~100 文件)、middleware、`getLangFromUrl`                                                                                                                                  |
| `src/data/site/languages.yaml`                                     | 切换器注册表 (code/name/locale/textDirection/enabled) — 用户展示顺序, Header 有 `enabled !== false` 过滤; 亦驱动 pageLangs、check 门槛 locales、hreflang enabled 集                                                      |
| `functions/_middleware.ts`                                         | CF Pages 语言重定向: `LANGUAGES` + `REMOVED_LOCALES` (zh,vi,hi,ja,ko) + `ACCEPT_LANG_MAP` (含 fil→tl, iw→he, in→id 别名) + `LOCALE_MAP` (国家码→语言)                                                                    |
| `src/config/seo-suppress.json` + `src/config/sitemap-exclude.json` | 渲染层 noindex + sitemap 排除 (同口径防漂移)。2026-11-09 第五批毕业后的 21 码/12 码语言正则已删除, 仅剩功能路径 (internal/keystatic/search/login/register/ai-context) + `/en/` 镜像 noindex                              |
| `astro.config.ts`                                                  | `redirects` 对象语言下架壳页 (`/zh/`,`/ja/`,`/ko/` → `/`; 旧 `LEGACY_REDIRECTS`/`buildLocalizedRedirects` 已随 2026-10 船内容清理移除)                                                                                   |
| `scripts/fold-untranslated-canonical.mjs`                          | `LANGS` 列表 (noindex 页自动跳过, 毕业后才实际生效) + `STOPWORDS` 语言检测词条 (cs 2026-09-27、pl 2026-09-28、拉丁 14 语言 2026-11-09 新增; sv/no/da/nl/fi/pt 原有, el/ru/ar 原有, th/he 2026-11-09 新增 NON_LATIN 正则) |
| `scripts/generate-geo-files.ts`                                    | llms-full.txt 的 `## Site Pages` 段（111 页，每次 build 重建；之前的 base 段保留）+ 默认 `llms.txt` 兜底（已存在则跳过）；`build-geo-v4.ts` 与每语言 `public/{lang}/llms.txt`（32 个含死链孤儿）已于 2026-11 移除        |

其他固定列表: `Layout.astro` `FULLY_LOCALIZED` = 全部 37 语言 (2026-11-09 第五批 21 语言毕业后从 16 扩至 37; hreflang 背书门槛) 与 `RTL_LANGS={'ar','he'}`; `generate-sitemaps.mjs` hreflang alternates = 36 非英语言; `generate-ai-corpus.mjs` LANGS (37 语言全含); `tools/i18n-wordcount.mjs` 语言清单 (含全部毕业语言); `scripts/05_ci_gate.py` `LOCALES`/`STRIP_LOCALE` (37 语言, locale_of 判定入口) 与 `scripts/langdetect_lite.py` (`_SUPPORTED` 停止词表 16 语言 + ja/zh, 其余经 `SCRIPT_FAMILY`/`_DUAL_FAMILY` 脚本族判定) — 新语言毕业时两脚本必须同步, 否则闸门把新语言判为 locale=en 产生 lang 属性不符误报阻断 CI (2026-11-09 首次 push 即触发 522 阻断)。

### 16.2 新语言种子构成 (每语言 4 件事)

> **2026-10-26 注意**: `tools/l10n/`、`ui-seed.mjs`、`i18n-audit.mjs`、`i18n-apply.mjs` 已随船内容清理删除 (§15.2)。以下为历史流程记录; 重新接入新语言时需先重建等价的 UI 键注入与泄漏审计工具 (或手工编辑 `i18n-config.json`)。

1. **导航 UI 键**: `tools/l10n/ui.<lang>.json` (~84 键 = Header navTextMap 全部 `nav.*`/`cta.*` + `header.language` + `search.*`×3) → `node tools/ui-seed.mjs <lang>` 注入 `src/data/site/i18n-config.json` (100% 覆盖必需键否则中止; 表键必须在 EN 字典内, 防拼写错误)
2. **config**: `src/config.<lang>.yaml` (模板 `config.fr.yaml`) — 翻译 metadata (title/description/keywords 自然本地化)、`openGraph.locale`、`siteSettings` (he 需 `textDirection: rtl`)
3. **home 完整翻译**: `node tools/page-seed.mjs <lang> home` (EN 副本) → `node tools/i18n-audit.mjs home.yaml` → 翻译 `tools/l10n/home.<lang>.json` → `node tools/i18n-apply.mjs home` → 复扫 0 泄漏
4. **门槛文件**: `node tools/page-seed.mjs <lang> about contact news` (有意 EN 副本 — check-translations 只要求存在; 语义上等同 EN-fallback 渲染)

UI 逐键回退: `_gen-uiall.cjs` 生成时合并 `{...en, ...lang}` — 部分 UI 字典缺键时组件不会拿到 undefined (整字典回退仍兜底字典缺席的语言)。

### 16.3 新语言状态表 (graduated = 进入索引/sitemap/hreflang)

| 语言 | nav UI | config | home 译 | 门槛文件                 | graduated                        |
| ---- | ------ | ------ | ------- | ------------------------ | -------------------------------- |
| ja   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | 是 (2026-09-29; 2026-10-16 删除) |
| ko   | ✓      | ✓      | ✓       | EN 副本                  | 否 (2026-10-16 删除)             |
| th   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| tr   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| id   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| cs   | ✓      | ✓      | ✓       | 79 页全译                | **是 (2026-09-27)**              |
| sv   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | **是 (2026-09-28)**              |
| da   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | **是 (2026-09-28)**              |
| el   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | **是 (2026-09-28)**              |
| no   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | **是 (2026-09-28)**              |
| ru   | ✓      | ✓      | ✓       | 79 页全译 + 残留 EN 归零 | **是 (2026-09-28)**              |
| hr   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| hu   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| ro   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| sk   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| bg   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| sl   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| sr   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| lt   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| lv   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| et   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| he   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| ms   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| tl   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| kk   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| uz   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| uk   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| az   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |
| fa   | ✓      | ✓      | ✓       | 全译 (R1–R6)             | **是 (2026-11-09)**              |

RTL: `ar` + `he` (`Layout.astro` RTL_LANGS); 塞尔维亚语 = Latin 转写 "Srpski"; 他加禄语代码 = `tl` (全站 `[a-z]{2}` 正则兼容, `fil` 经 ACCEPT_LANG_MAP 别名映射)。

### 16.4 语言毕业清单 (graduation checklist)

新语言深度翻译完成、准备进入索引时, 逐项执行 (第 1 项涉及的工具已于 2026-10-26 删除, 见 §16.2 注意; 需重建等价工具或全仓 `rg` 扫描替代):

> 2026-09-27: cs 首个执行本清单 (解除 noindex、进入 sitemap/hreflang、fold STOPWORDS 生效; checkGraphNodes 0 WARN)。
> 2026-09-28: sv/da/el/no/ru 第二批执行 (残留 EN 翻译 161 文件 781 处后毕业; el/ru 无 STOPWORDS 需求 — NON_LATIN 正则覆盖; audit 0 泄漏)。
> 2026-09-28: nl/fi/pl/ar/pt 第三批执行 — 属 §15 原始 15 语言 (不在 16.3 新语言表内), 此前因残留 EN 被 24 码正则整体 noindex; 残留 EN 翻译 145 文件 778 处后毕业 (pl STOPWORDS 新增, nl/fi/pt 原有, ar 走 NON_LATIN; WorldMap 界面/区域名同步本地化 `src/data/world-map-data.ts`)。
> 2026-09-29: ja 第四批执行 (首个 CJK/非拉丁非西里尔/非阿拉伯语言) — 79 页全译, 残留 EN 48 处均为白名单 (数字格式、产品型号、人名、认证代码、公司名); 语言检测走 NON_LATIN CJK 正则; WorldMap 界面/区域名 + `src/data/site/about.ja.yaml` 站点级文案同步本地化。（该语言已于 2026-10-16 删除, 见 §16.6）
> 2026-11-09: **第五批执行 — 剩余 21 个 noindex 语言全量毕业** (az,bg,et,fa,he,hr,hu,id,kk,lt,lv,ms,ro,sk,sl,sr,th,tl,tr,uk,uz), 至此 **37 语言全部进入索引**。缺口收敛 (Round 1–6 提交链): ① disclaimer/terms 两页 per-lang Body 组件缺口 — 以 `legal-model.json` 结构化提取 + 共享 walker (`legal-slots.mjs`) + Google chunked 翻译 (品牌拉丁回写 fixup、th 佛历 Intl 日期、sr 西里尔正字法) 程序化生成 `src/components/legal/{disclaimer,terms}.{lang}.astro` 组件; ② 产品卡加热器句 — `PRODUCT_L10N` 补 21 条目 (5 titles + 5 summaries + cats.pool), 首页/列表/PDP 三面同步; ③ **privacy 页同构缺口 (构建后 fold folded=21 才暴露 — 事前评估"0 缺口"结论错误, 16 个已毕业语言均有翻译 privacy)** — 同管线扩展 (extractor h4 支持、walker h4 分支、generator privacy 分支, slots 95→135) 补译补生成, 三页合计 **63 个 legal 组件**。fold 防误折: 拉丁 14 语言加 STOPWORDS (选词避开 Latin Extended 字符, token 正则 `[a-zà-ÿ]` 之外), th/he 加 NON_LATIN 正则 (kk/sr/bg/uk→ru 西里尔、fa→ar 阿拉伯范围原有覆盖)。seo-suppress/sitemap-exclude 的 21 码与 12 码正则行删除, FULLY_LOCALIZED/generate-sitemaps/generate-ai-corpus/i18n-wordcount 扩至 37。**CI 闸门同步 (首次 push 后 SEO 闸门 522 阻断暴露)**: `05_ci_gate.py` LOCALES/STRIP_LOCALE 扩至 37 (此前 21 语言被判 locale=en → lang 属性不符 + 重复 title 误报); `langdetect_lite.py` 加脚本族判定 — 21 新语言无停止词表, is_mismatch 对 unsupported expected 只做跨族判定 (族内误判豁免: bg/sr/uk/kk→ru 西里尔、fa→ar 阿拉伯、拉丁新语言被 pt/fi/cs 误判; 跨族才阻断; det=en 不豁免保留 A-X 信号; sr 双文字 {cyrillic,latin} 集合交集), 新增 he/th 脚本块; contact 页 PAGE_META/PAGE_DESC 补 21 语言译条 (此前 title/desc EN 回退 — sweep 只扫 `<main>` 不扫 head)。HUB_TEXT 侧栏卡片 31 语言 (10 已毕业 + 21 新) EN 回退为存量 A-X 债务, 2026-11-10 已清偿 — HUB_TEXT 表补 31 语言 5 键译条 (cardTitle/hqTitle/hubTitle/emailNote 走 Google 翻译管线 + MT 手工修正: da/no/sv 改 "Kontor i USA" 避开中性形容词屈折、el "Γενικές απορίες"/fi "Yleiset kyselyt" 修 enquiries 误译、hr "Kontakt podaci"、sk "Kancelária v USA"/sl "Pisarna v ZDA" 弃 "úrad/urad" (政府机构义)、sr 全西里尔 + "Aquafarer LLC" 弃 "ЛЛЦ" 音转、az/uz 弃 "MMC/MChJ" 保法定名 LLC、tl "Sentro ng Produksyon at Eksport"、fa ZWNJ "می\u200cدهد"、ar 弃 "شركة"、nl/sv emailNote 改名词形); 侧栏明细行 (地址 "Design, Sales & Billing — New Mexico" / "Qingdao — FOB Qingdao port") 2026-11-10 同日补译 37 语言 (HUB_TEXT 增 hqDetail/hubDetail 双键, 模板硬编码改 {hub.*} 接线; 手工修正: tl hubDetail MyMemory 返回无关翻译记忆垃圾重译、uz HTML 实体解码、sr Циндао 音转纠正 (MT 误 Кингдао)+FOB 弃 ФОБ、ar فوب→FOB、es/it 破折号复原、da/no FOB-havn 复合词); hqTitle 品牌名 "Aquafarer LLC" 与 "MST & GMT+8" 全语言保真。dist 终验: 63/63 法律页可索引 + self-canonical, live(self-canonical)=536 / folded=1 (根 index.html 尾斜杠伪折叠) / noindex=124 (全为设计内), sweep-dist-en EN 残留 0, U+FFFD 乱码扫描 854 文件 0 命中, i18n-wordcount 23 路由全 ≥138 词进 sitemap, 本地闸门复跑 0 阻断。**生产全量终验 (2026-11-10, 606 URL 扫描 0 问题)**: sitemap-index 7 分片 (entity 536 + ai 21 + knowledge 41 + products 8; community/media/learning 3 个空分片为设计占位 — 对应板块无内容, 生成器无条件写出, 空 urlset 合法) 全部 URL HTTP 200 + canonical 自指 + 无 noindex + hreflang alternates 齐全; robots.txt AI 爬虫全 opt-in + /internal//login//keystatic 禁抓; /ai-corpus.json manifest 200 (generatedAt=最新部署时间戳) + en.json 与本地 dist 字节一致; rss.xml (news-worker) 200; llms.txt 98 行在线。

1. UI 字典 ~1,721 键补全 (`tools/l10n/` 分批注入), 该语言 `node tools/i18n-audit.mjs` 泄漏 ≈ 0 (含 about/contact/news 真翻译)
2. 从 `seo-suppress.json` + `sitemap-exclude.json` 的 29 码正则中移除该语言代码
3. 加入 `Layout.astro` `FULLY_LOCALIZED` (hreflang 背书) + `scripts/generate-sitemaps.mjs` LANGS
4. 在 `scripts/fold-untranslated-canonical.mjs` 添加该语言 STOPWORDS 词条 (拉丁字母语言; CJK/泰文/希伯来文经 NON_LATIN 正则或天然低命中自动豁免)
5. 加入 `scripts/generate-ai-corpus.mjs` LANGS
6. 扩展 `tools/i18n-wordcount.mjs` 的语言清单
7. 更新本节状态表 (graduated 列 + 日期), 并核查 checkGraphNodes WARN 清零

### 16.5 运行注意

- **构建规模**: ~645 页 / 37 语言 (2026-10-16 删除 ja/ko/vi 后从 ~12,000 页回落, 页面由 page-content 模块化管线按页生成), Cloudflare Pages 20K 文件软限制内
- **REMOVED_LOCALES**: 现为 `zh,vi,hi,ja,ko` — zh/vi/hi 为历史种子语言回收, ja/ko 为 2026-10-16 语言删除后永久 301 剥前缀 (Google 已缓存旧 URL, 权重回收); tr/th/id/cs/he/ro 曾 301→根路径 (2026-09-23 解除, 重新曝光安全 — 页面 noindex 直到毕业)
- **checkGraphNodes WARN**: 每个新语言 ~数十条图节点名缺失警告, 非阻塞噪音, 毕业清单第 7 项清理
- **切换器布局**: 弹窗 `grid-cols-4 sm:grid-cols-5` + `max-h-[65vh] overflow-y-auto`, 容器 `max-w-2xl`; 展示顺序 = `languages.yaml` 文件顺序 (用户指定)
- **`functions/_middleware.ts` 随 Pages 自动部署** — push 即生效, 无需单独发布

### 16.6 语言删除 (2026-10-16, 40 → 37)

> 删除 ja/ko/vi: 翻译 ROI 不及预期 (ja 79 页全译投入未换来自然流量), vi 为 2026-09 扩充语言未毕业。commit `63a1b18` + `a476c8a`。

- **删除范围**: `src/pages/[lang]/{ja,ko,vi}/`、`src/data/pages/{ja,ko,vi}/`、`config.{ja,ko,vi}.yaml`、`tools/l10n/*.{ja,ko,vi}.json`、i18n-config.json/UI 字典相应键、FULLY_LOCALIZED/seo-suppress/sitemap/ai-corpus 等注册表条目
- **重定向兜底 (双层)**: ① astro.config `LEGACY_REDIRECTS` 追加 `'/ja/': '/'`、`'/ko/': '/'` 静态壳页 (meta-refresh + noindex + canonical; validate-dist/fold/ai-corpus 跳过 noindex 页) — 本地 preview 生效 (注: `LEGACY_REDIRECTS` 表已随 2026-10 船型内容清理整体移除, 语言下架壳页现位于 astro.config 的 `redirects` 对象, 禁止重新引入); ② 生产环境由 `_middleware.ts` `REMOVED_LOCALES=['zh','vi','hi','ja','ko']` 301 剥前缀接管 (中间件优先于静态资产)
- **死循环修复 (2026-10-18)**: 删除时 `LOCALE_MAP`(JP/KR) 与 `ACCEPT_LANG_MAP` 仍含 ja/ko → 日韩访客根路径被 302 至 /ja/、/ko/ 壳页 → meta-refresh 回根 → 死循环; 已从 `LANGUAGES`/`LOCALE_MAP`/`ACCEPT_LANG_MAP` 移除 ja/ko (checkout.ts 语言集合同步清理)
- **翻译缓存清理**: `.cache/` 7 个 git 跟踪缓存移除 8,033 条 ja/ko/vi 死键 — page-translate-cache 4,743 / content-v2-bing-cache 1,357 / body-components-cache 1,041 / product-translate-cache 610 / i18n-translate-cache 121 / content-l10n-cache 100 / page-meta-cache 61
- **残留死引用清理 (2026-10-18)**: `05_ci_gate.py` LOCALES/STRIP_LOCALE 移除 ja (含汉字/假名特判分支); `translate-products.yml` 默认语言 ja→cs; `fill-missing-page-yamls.mjs`/`inject-rib-l10n.mjs` LANGS 移除 ja; `i18n-tool.cjs` 用法示例更新; 历史一次性脚本 (add-missing-labels-csja.mjs、batch-translate.mjs 注释) 保留原样
- **场景数据 SSoT (2026-10-16, commit `78f1776`)**: pool-ideas 三件套 (`src/data/pool-ideas.ts` + 2 个 MDX) 的尺寸/型号码/壁厚/水深/PSI 全部对齐 `src/data/pool-catalog.ts` (48 型号目录基准); 新增场景数据必须先查目录, 禁止虚构尺寸

---

## 17. 图片处理 (WebP + 尺寸注册表)

### 17.1 WebP 迁移 (P6, 2026-10-21)

`public/images/pools/` 下 15 张 >100KB 产品图已从 PNG/JPG 转为 **WebP (1600px, q82)**: 18.5MB → 0.85MB (**-97%**)。全库 215 处引用 × 97 文件同步替换, 旧图删除后由 R2 自动 prune 清理 (§9.2)。

**效果** (Lighthouse, 产品页): Performance 46 → **67 线上** (84 本地), LCP 15.3s → **3.5s** (1.8s 本地), CLS 0。对比记录见 `docs/technical-audit-2026-10.md` §1.4。

**规则**:

- 新增产品图一律使用 WebP (1600px, q82 起步)
- `<Image format="webp">` (Astro 组件, Sharp 优化) 与静态 `public/images/**/*.webp` 并存; 本地图片走 `astro:assets`, 远程图片走 Unpic CDN
- Hero 图 `loading="eager"` + `fetchpriority="high"`

### 17.2 image-dimensions.json (CLS 修复)

`scripts/generate-image-dimensions.mjs` 在每次构建时解析全站图片宽高, 写入 `src/data/site/image-dimensions.json` (**36 条, SSOT**), 由 `vendor/integration/img-dimensions.ts` 在构建期为已知图片注入 `width`/`height` 属性 (防 CLS)。

**规则**: 新增/替换/重命名 `public/images/` 下图片后, 无需手动维护 — 下次 `npm run build` 自动重建; 但**提交前需确认 registry 覆盖所有新图** (运行构建后 git diff 该文件)。

---

## 18. 依赖安全 (2026-11)

### 18.1 npm audit 清零 (2026-11-02)

整改前 1 critical / 16 high / 21 moderate / 2 low → 整改后 **0 critical / 0 high / 0 low** (剩 20 moderate 均为 dev-only 工具链)。commits `5d5a812` + `f7f552e` + `a7d146e`。

**关键修复** (全部范围内升级, 非 breaking):

- **better-auth 1.7.3 → 1.7.15** — OAuth 代理用户冒充漏洞 (CVSS 7.4, GHSA-r4xp-prcw-77qf, 修复于 1.7.7); admin-worker 生产认证, deploy.yml 每次 push 重新部署 5 个 Workers, 修复即生效
- **zod 4.5.4 → 4.6.7** — 超大集合校验内存耗尽 DoS; contact-worker 运行时输入校验
- astro 7.3.2→7.4.4 · vite 8.2.2→8.3.5 · astro-icon 1.1.5→1.2.0 · sharp/wrangler/undici/miniflare/js-yaml/fast-uri/source-map-js/prosemirror-view (其余 high, 范围内)

**保留不修的 20 moderate**: eslint/@typescript-eslint 链、drizzle-kit 1.0-beta (→@esbuild-kit/esbuild≤0.24.2)、keystatic、glob/minimatch — 均为 dev-only 工具, npm 审计建议的"修复"是 semver-major **降级** (如 drizzle-kit 1.0-beta→0.18.1、eslint-plugin-astro 0.10→0.9), 会破坏工具链且不进生产运行时; **禁止盲目 `npm audit fix`**。

### 18.2 gen-icon-svgs ESM 兼容

astro-icon 1.2.0 依赖的 `@iconify/utils` ≥3 为纯 ESM (`"type": "module"`, 无 `lib/index.cjs`), CJS `require()` 失败。`scripts/gen-icon-svgs.cjs` 改为 async IIFE + 动态 `import()` (Windows 下需 `pathToFileURL()` 转换路径), 生成结果不变 (88 个 SVG)。

### 18.3 prettier-plugin-astro 1.x 重排

0.14.1 → 1.1.1 (major): `.astro` 模板新增多行 label/input 内容换行规则, 全仓 241 文件一次性重排 (纯空白/换行, 零内容变更, 乱码扫描 660 文件 0 匹配)。新建/修改 `.astro` 文件后必须 `npm run fix`, 否则 CI prettier gate 拦截。

### 18.4 npm update 全范围轮 (2026-11-14, `328d227`)

10 个 dependabot PR (#22–#31, 全部 patch/minor, 无 TS 7 红线 PR) 触发 lockfile 纪律核查: 20 个包落后于 in-range 最新版。按 AGENTS.md 纪律执行 `npm update` (非逐个合并 PR — 10 个 PR 均改 package-lock.json, 顺序合并必然冲突), 覆盖并超越全部 PR 目标: astro 7.4.5→7.4.12 · better-auth 1.7.17→1.7.23 · wrangler 4.157.0→4.162.0 · tailwindcss 4.3.4→4.3.5 · glob 14.0.3→14.0.6 · eslint 10.14.0→10.15.0 · @astrojs/mdx 8.1.2→8.1.6 · markdown-remark 7.3.5→7.3.9 · sitemap 3.7.4→3.7.5 · @typescript-eslint 8.72.1→8.72.2 · prettier 3.9.10→3.10.1 · jose/marked/workers-types/@iconify-json/tabler 1.2.43→1.2.45 等。typescript 保持 6.0.3 (TS 7 红线)。

- **prettier 3.10.1 副作用**: 新格式规则标记 6 个既有文件 (5 个 legal 组件 + product-l10n.ts), `npm run fix` 重排后过 gate — 升级 prettier 版本后必须全仓跑一次 fix/check, 否则 CI 拦截 (§11.25 同型)
- **tabler 1.2.45 副作用**: calendar 图标 path 数据微调 (icon-svgs.ts 1 行), 无图标丢失
- **audit**: 17 moderate (2026-11-05 为 18, 一条 advisory 收敛), 0 critical/high/low, 三条根因与降级陷阱不变
- 推送后 dependabot 自动关闭全部 10 个 PR (open PRs 归零)
- **npm update 挂起注意**: 直接 `npm update` 曾超时 10 分钟无进展, 加 `--no-audit --no-fund` 后秒级完成 — audit/fund 网络端点在代理环境下可能挂死

**事故 (328d227 首推即红, 2026-11-14)**: Windows 下 `npm update` 产出的 lockfile **缺少 esbuild@0.25.12 的全部 26 个 `@esbuild/*` 平台条目** — Linux CI `npm ci` 需要 `@esbuild/linux-x64@0.25.12` → EUSAGE "lock file's esbuild@0.25.12 does not satisfy esbuild@0.28.2 / Missing ... from lock file", Build & Deploy + SEO gate 双红。本地 Windows `npm ci --dry-run` 检不出 (npm 只校验当前平台需要的条目)。修复: `npm install` 原地重解析补齐 26 条 (vite 顺带 8.3.6→8.3.8, 范围内), 重跑构建 675 页全过。

**预防**:

- Windows 上执行 `npm update`/`npm install` 后, 核对 lockfile 中平台可选依赖的**非 Windows** 条目齐全: `@esbuild/linux-x64`、`@tailwindcss/oxide-linux-x64-gnu`、`lightningcss-linux-x64-gnu`、`@img/sharp-linux-x64` (CI 报错清单即核对清单 — EUSAGE Missing 行逐条对照)
- 本地 dry-run 通过 ≠ Linux CI 通过; 平台缺口只能在 CI 或逐条核对中发现
- CI 轮询脚本必须**按 workflow 名过滤并要求三个工作流全部出现** — dependabot 的 rebase runs 与主提交同 head_sha, 会挤占 `per_page=10` 首页, 曾造成 328d227 "ALL_GREEN" 误判 (实际 Build & Deploy 已红)

## 19. GEO 第三轮审查落地 (2026-11-03)

外部 AI 第三轮 GEO 深度审查的可实施项全部落地, 提交链 `25c19b5` → `0354fa6`, prod-smoke 50 → 54 项全绿。

### 19.1 变体级 FOB offers + 指南 PDP 深链 (`25c19b5`)

批发 ProductGroup `hasVariant` 每变体注入 FOB `Offer`, 见 §5.6。另为 3 篇消费向指南 (how-to-choose / setup / maintenance) 填充 `relatedProducts` — 指南模板 (`src/pages/guides/[slug].astro`) 经 `findProductsBySlugs` 渲染带图带价产品卡深链, 3 篇合计覆盖全部 5 个产品 slug; choose 指南 `relatedGuides` 增补 operating-costs 形成簇内互链。

### 19.2 新内容三件套 (`885f854`)

- **`/guides/inflatable-pool-operating-costs/`** — `guides.ts` 第 17 篇消费指南: 四条成本线 (初次充气 0.17 kWh / 过滤泵运行 / 水 / 化学品), 全部数字复用已核实口径 (PDP TCO FAQ), 公式优先不虚构价格。
- **`/pool-volume-calculator/`** — 客户端容量计算器: 圆/矩形几何 (V=πr²h / V=lwh), 填充率默认 85% (80–90% 规则), 输出升/吨与注水时间; 内联 `<script>` 必须 IIFE (Rust 编译器红线: 无顶层 return), `noscript` 公式回退 + 算例保证无 JS 可用; `find-your-pool.astro` 有入链。
- **`/products/compare/` 交互式工厂尺寸表** — 批发区 48 SKU 可筛选表: 系列 chips 过滤 (`data-series` 行属性 + IIFE, `aria-pressed`, 无 JS 时全表降级可见), 数据源 `pool-catalog.ts` SSOT。

### 19.3 llms.txt 手工维护陷阱与防回归 (`a844242` + `0354fa6`)

`public/llms.txt` 手工维护 (无生成器, `generate-geo-files.ts` 仅在文件缺失时写默认), 已两次滞后于内容批次 (2026-10-31 审计 §2.4; 2026-11-03 新页漏录)。本次补录 3 新页 + 计数 16→17, 并固化防回归:

- prod-smoke 结构性同步断言: 生产 llms.txt 必须覆盖 `guides.ts` + `procurement-guides.ts` 全部 slug, 且 "Markdown Endpoint Index" 行手写计数 (17 consumer / 6 B2B) 与 SSOT 一致, 否则发布门禁 fail。
- AGENTS.md "AI Content Manifests" 段记录维护规则: 新增指南/工具页必须手工更新 llms.txt 正确分区 + 计数行。
- llms-index (`llms-index.ts`) 是动态的 (`guides.length` 自动), 无需手工同步。

### 19.4 GEO 基线题包 (`78a8c25`)

`docs/ai-visibility-baseline.md` 新增 §7 答案要点 (26 题逐题核实口径 + 预期引用 URL) 与 §8 预填记录表 (每平台复制一份)。人工执行流程: `npm run smoke` (54 项) → 6 平台 × 26 题 → 结果追加到 §5 记录区。

### 19.5 附带修复

- `generate-sitemaps.mjs` 错误消息双重编码 em-dash 修复 (`a7e11e4`); 全仓 802 跟踪文件乱码终扫仅剩 2 处刻意保留 (TECH.md 乱码文档示例、`fix-garbled.py` 搜索模式)。
- #9/#10 dependabot PR 待 GitHub 定时任务自动关闭 (main 已含目标版本)。

### 19.6 季度复测与 P1-C @graph 接线 (2026-11-03)

按 `docs/technical-audit-2026-10.md` §4 复测建议执行第一轮季度复测 (记录见该文件 §5): 16 项检查 — 14 PASS / 1 已知阻塞 (merchant-feed 0 items, Stripe checkout 未开通) / 1 发现: **P1-C @graph 实体枢纽从未接线** (`schema-graph.ts` `buildGraph()` 零调用者; AGENTS.md 与 2026-10-21 基线 §1.1 均描述了未落地的状态)。

当日完成接线 (`51fa668`):

- `JsonLd.astro` 新增 `graph` prop — 完整 @graph 载荷绕过 type 分支直接渲染 (守卫 `graph || keys > 2`)。
- `index.astro` / `[lang]/index.astro` 传 `disableGlobalLd` (关闭 Layout 全局 Organization/Person/WebSite 三块), 经 `<JsonLd graph={buildGraph(homeExtras)} />` 输出单一 @graph: Organization+ManufacturingBusiness 双 @id 枢纽 + WebSite + Brand + Person(founder) + FAQPage/ItemList 页面级节点 (首页无 BreadcrumbList — `schema-graph.ts` 约定面包屑仅用于非首页)。
- 非首页保持 Layout 全局块 + 页面级标记 (如 about = 3 全局块 + BreadcrumbList)。
- prod-smoke 54 → 57 项: 首页 `"@graph"` / `ManufacturingBusiness` / `/de/` 抽样三条断言。部署后首次 smoke 可能因 CDN 边缘缓存旧页出现批量假失败, 复跑即绿。
- entity.json 实际路径为 `/.well-known/entity.json` (源 `src/data/geo/entity.json`), 非 `/entity.json` — 复测脚本曾因此误报 404。

### 19.7 可购买性轮: 三零售 SKU 定稿 + 选型工具重构 (2026-11-03)

用户指令: 停止扩充泛化页面, 集中可购买性。按外部审查执行 (审计 → 修复 → 验收):

**hot-tub-round 全模块绑定 RS2018** (`src/content/products/hot-tub-round.mdx`):

- 零售页只卖一个固定套装 (SKU FZ-SPA-RND = 工厂件 RS2018, Ø 2 × 0.8 m, 10 cm): summary/description/metadata 全部改固定尺寸; specs 新增 `Model` 行 + `Size range` 值改为固定串 (保留 "Size range" 标签 — `/products/` 总览卡 `spec('size range')` 查找依赖); Key Features 重写; 删除 "reduces heating energy costs" 无证据主张; gallery 首图 alt 诚实标注 "RS1808, 1.8 m wholesale model" (照片错配属阻塞项)。
- `product-page-content.ts` 新增 `fixedSetSize?: string` 字段; hot-tub 值 `Ø 2 × 0.8 m (factory item RS2018, 10 cm drop-stitch wall)`。

**FitGuide 双分支** (`src/components/product/FitGuide.astro`): 新增 `fixedSize` prop。固定套装卡 (hot-tub): 尺寸显示 "as listed in the specifications above"; 蓝灰卡 (无 fixedSize): 原 "exact dimensions listed in the specifications above" 虚假承诺改为 "exact dimensions of this set are confirmed with your order, so ask us before you buy if you need them upfront"。两个调用方 (`pages/products/[slug].astro` + `pages/[lang]/products/[slug].astro`) 传 `fixedSize={detailV2.fixedSetSize}`。

**装箱声明范围限定** (一刀切 "pump/repair kit included" → 按套装): `products/index.astro` 零售总述、`returns-and-warranty.astro` (退货配件 = "all accessories originally supplied with your selected set"; 保修段维修包限零售游泳池套装)、`faq.ts:23` (泵限游泳池套装, 删 filter pump)、`guides.ts:395`、`best-drop-stitch` 页 FAQ、`product-business-data.ts` (删满意度/工单数字、"professional cold plunge"、"heats fast")、`pool-ideas.ts:198` (booking magnet → most requested amenities)、`products.ts` hot-tub 记录 (ai_specs 单值 / ai_comparison 删 "heats faster" / ai_faq 三尺寸问答改 "Which size is sold online")。

**37 语言 home/about YAML 同步** (72 文件, `sync-yaml-claims.mjs` 行级手术 — yaml 库重序列化会整体重排): features `tabler:box` + FAQ included 限 "Every swim-pool set"; FAQ sizes 描述清除全部 "48 standard SKUs" 过时主张 (2026-08 翻译漂移残留 — 家用 FAQ 与批发 48 SKU 目录无关); `compare_collections` 行 1 href 蓝色 PDP → `/products/` 总览; 36 语言以 sameAsEn 落盘 (项目惯例)。验证: ru diff 精确 4+1 行, 无 BOM, LF 保持。

**`/find-your-pool/` 双入口重构** (`src/pages/find-your-pool.astro` 整页重写):

- 入口 A "Shop a Retail Set": 3 静态卡 ($299/$399/$499, sku/included/size) + 4 诚实边界卡 (无按摩喷头 / 加热外置 / 高架需签核 / 配送下单前确认) — 2/3 零售 SKU 尺寸未签核, 交互过滤不可能诚实, 故静态卡。
- 入口 B "Plan a Business or Project Pool": 原问题/尺寸输入/通知/no-match 逻辑与 `data-finder` 埋点全保留; CTA 改 "Request a quote" (`/contact/?product=` 编码预填) + Guide; tracking 扩展 `result_click` contact-quote target。
- purpose-personal 横幅指回零售区 (原 purpose-business → for-businesses 横幅移除 — 该区即 B 端规划器)。

**验收断言** (prod-smoke 57 → 58 项): hot-tub PDP 三 marker (`RS2018` / `Ø 2 × 0.8 m` / `fixed-size retail set`) + 三 notMarker (`Diameter 1.8 m` / `8 cm / 10 cm / 15 cm` / `fitg-size`); find-your-pool 四 marker (`data-finder` / `Shop a Retail Set` / `FZ-SPA-RND` / `Request a quote`); returns 新措辞 marker。dist 本地验证: 37 语言首页 48-SKU 残留清零; `pool-catalog.ts` 恰 48 条 — wholesale/oem-odm/private-label 页 "48 SKUs" 主张属实 (SSOT 对账)。

**仍阻塞** (不得编数): 蓝/灰零售 SKU 12 字段签核表、灰款 +$100 原因、浸泡池 $499 实际装箱清单、RS2018 实物照片 (现 hero 为 RS1808 工厂照)、配送数据 (国家/发货地/时效/跨境税费)。

### 19.8 find-your-pool v2: docx 外部审查响应 (2026-11-04)

外部审查 docx (`检查Find Your Pool选型工具逻辑.docx`) 对 v1 双入口版提出 P0×4 + P1×2; v2 整页重写逐项落地:

- **P0-1 purpose 前置真分流**: purpose 移到第一问并真正切换结果区 — personal → 仅 3 个零售候选卡 (`#retail-results`, 默认 `display:none`, JS 切换; `<noscript>` 样式回退显示); business → `#project-planner` 候选族。按钮三态: 零售 "View This Exact Set" / 商业 "Request a Project Review" (`/contact/?project=` 预填) / 状态面板 "Ask for Product Advice" + "Request Compatibility Advice"。商业区标题改 "Potential Product Family for Review" (禁 "Your Perfect Pool" 式确认语)。
- **P0-2 空间口径统一**: 输入标签 "Total clear, level area available", 帮助文案 "Enter the full length and width available for the pool, access and required equipment. Do not subtract clearance yourself"; 删除全站统一 50 cm 通道主张 (v1 遗留) → "required clearance depends on the selected model, equipment layout and applicable local requirements"。dims 四态: none/partial (提示补全, 回退 bucket)/invalid (0/负/非数字 → 警告 + 不做精确匹配)/valid (覆盖 space bucket, 保留 use 过滤); 矩形 90° 旋转匹配, 圆形直径比两边。
- **P0-3 功能硬筛选**: features 改 4 选项多选 (ambient 互斥清空其余): bubble/massage → 全部结果卡隐藏 + "Unsupported feature" 面板 (按摩文案 = docx 原文 "We cannot confirm a standard massage-jet configuration for your requirements."); heated → 仅 soak 候选卡 (`data-heat="candidate"`) + "Compatibility review required" 面板 (无型号级已核实加热配置, 不输出确定推荐)。
- **P0-4 高架/商业转审核**: install-raised → 状态面板 "Installation review required" (优先级仅次于 unsupported/no-fit), 候选卡保留但明确 "installation suitability is not confirmed"。
- **P1 no-match 5 态**: 状态面板 `data-finder-status` 单面板承载 unsupported / no-fit (含哪一维度不满足 + "do not reduce required installation clearance to force a fit") / review-required / compatibility-review; insufficient-data 为卡级静态标注 — 蓝/灰卡 `data-dims-known="false"` 永不参与尺寸匹配, 卡面常显 "Insufficient data: ... we do not substitute factory sizes"。
- **P1 卡片收敛**: 14 个商业 setup 全部绑定真实目录型号 (SS151508/SS181808/SS202008/SS202010/SS211608/SS242410/SS302010/SR341220/SR561250/S2005–S10012/RS1808/RS2018/RS2308, 对账 `pool-catalog.ts` 48 条 SSOT; 注意 SR341220 实为 4×3×1.2 — 命名 SR34=4×3); "3 × 2 m square" → rectangular; Hospitality Plunge 删 "connects to standard cartridge filtration" 未核实兼容主张 → "quoted and confirmed per project"; use 问题扩 6 选项 (use-cold/use-fitness/use-pets 新增, 消除不可达结果卡); who 标签降级为解释组 (TAG_TEXT 渲染进 why-text, 不参与过滤)。
- **埋点**: answers 快照 qid 化 (purpose/install/use/space/who/features 多选 join/dims); result_click target 扩 shop/guide/review/advice。
- **验收** (prod-smoke 58 项, finder 断言替换): markers `data-finder` / `Shop a Retail Set` / `FZ-SPA-RND` / `View This Exact Set` / `Request a Project Review` / `Potential Product Family for Review` / `Total clear, level area available`; notMarker `Request a quote` (v1 CTA 不得残留)。dist 静态验证: 状态面板五态文案全部在打包 JS chunk 内, 零售卡 `display:none` + noscript 回退确认。docx §10 交互用例表标注为需人工浏览器测试 (构建静态验证只覆盖分支存在性)。

**仍阻塞** (同 19.7, 另加): 蓝/灰固定尺寸签核前, personal 路径尺寸检查仅 RS2018 生效 (opts `[{d:2}]`); model-level 加热器/气泡设备兼容清单 (docx P0-3 要求, heated 目前只能 Compatibility review)。

### 19.9 /user-manual/ 产品手册页 (2026-11-04)

工厂 `USER MANUAL` 文件夹 (原版 PDF + 16 张步骤 JPG + 全部步骤 txt) 集成为 EN 单文件页 `/user-manual/`:

- **数据冲突与裁定**: 手册原文 Step 2 写工作压力 5–8 PSI (0.34–0.55 bar) / 上限 15 PSI, 与规格表 SSOT (`pool-catalog.ts`: OPERATING 4–5 PSI / RELIEF 6 PSI / MAX 8 PSI) 直接矛盾 — 6 PSI 泄压阀在手册工作区间内会持续泄气, 物理上不可能同时成立, 且 "5-8 PSI" 烧在压力表插图 (绿色 OK 区) 里。管理员裁定: **页面文字按规格表 SSOT 发布** (Step 2 → 4–5 PSI / 8 PSI 上限 / 6 PSI 泄压阀 / 热天降压提示), 带 5–8 PSI 的压力表插图不上页, **原版 PDF 照托管** (`public/files/drop-stitch-pool-user-manual.pdf`), hero 下琥珀色透明度框披露两份文件差异并标注 "confirming the correct figures with the factory"。矛盾数字未作为主张发布。
- **页面结构** (`src/pages/user-manual.astro`, 与 find-your-pool 同为 EN 单文件、无 [lang] 孪生): hero (PDF 下载 + cover 图) → Mandatory Safety Warnings 5 条 (Read First / Active Adult Supervision / NO DIVING–NO JUMPING / Do Not Walk on Walls / Remove Ladders & Toys / Electrical Safety, 前 4 条带 pictogram) → Setup 六步 (交替图文; Step 2/Step 5 带红框 WARNING: 压力上限 / 最高水位 10 cm) → Draining & Storage 四步 (Step 3 Complete Deflation 无图 — 源文件夹即无对应 JPG, 其 txt 物理位于 Step 2 子目录内) → Leak Detection & Patch Repairs (皂水检漏 + 4 步补丁, 2–3 cm 余量, 24 h 固化) → Related Help 6 卡 → CTA。插图中的梯子/砂滤泵/泳池罩为可选配件, 页面明示 "not part of every retail set — check the Included list on your product page"。
- **图片**: 15 张转 WebP q82 入 `public/images/manual/` (16 张中跳过 5–8 PSI 压力表图), 构建时 `generate-image-dimensions.mjs` 自动入尺寸注册表。
- **接线**: `support.astro` quickLinks 卡 (tabler:book) + gettingStarted 首条; PDP `SETUP_LINKS_BASE` 首条 (EN + [lang] 全部 PDP — `localizeHref` 对 root-only 路由不加前缀, [lang] 页安全, 标签按既有行为保持 EN); `public/llms.txt` Company 节手工加条目 (Iron Rule, smoke 只断言 guide slug 覆盖与计数, 新条目行不受计数断言影响); `generate-sitemaps.mjs` `AI_TOP_SECTIONS` 加 `/user-manual/`。FitGuide 未接 (上下文不合 + 新 ui key 需全语言 i18n 改动), 手册入口经 SetupStorage links 覆盖全部产品页。
- **验收** (prod-smoke 58 → 60 项): 页面 6 marker (`User Manual` / `Mandatory Safety Warnings` / `4–5 PSI` / `relief valve` / PDF href / factory-confirmation 框文案) + PDF 资产 contentType `application/pdf` 检查。

**仍阻塞** (本节新增): 工厂压力数字确认 (手册 5–8/15 vs 规格表 4–5/8/6) — 确认后需更新页面 + 更换/修订 PDF + 核对 AnswerCenter "What PSI" 问答; 其余同 19.8。

**工厂裁定落地 (2026-11-04)**: 工厂确认**使用时充气压力为 4–6 PSI** (原 SSOT 4–5), QC 6 / 泄压 6 / MAX 8 不变 — 6 PSI 语义从 "高于工作压力" 变为 "工作区间上限 + 泄压阀设定点"。全站更新 (提交含 109 文件):

- **SSOT**: `pool-catalog.ts` `POOL_OPERATING_PRESSURE` → `'4–6 PSI'`; user-manual 步骤 2 bar 换算 0.28–0.34 → **0.28–0.41 bar**; 透明度框改 "The factory has confirmed the correct figures" 口径 (原 PDF 照托管不变); prod-smoke 断言同步 (`'4–6 PSI'` + `'The factory has confirmed the correct figures'`, 60 项不变)。
- **机械替换 284 处**: PSI 锚定 `4–5 PSI`/`4-5 PSI` → `4–6 PSI`/`4-6 PSI` (保持各文件 en-dash/hyphen 风格; 37 语言 home/about YAML、5 PDP mdx、guides/procurement-guides/pool-ideas/products 等 data、manufacturing/quality-control/specs/oem-odm/wholesale 等 astro、README、prod-smoke、qa-checklist)。特例 84 处逐条断言 count==1: 37 份 about.yaml QC 短语整句替换 (见下)、36 语言 values item 逐语言 "tested above rated pressure" → "at the top of rated pressure" 改写、ar/es/fa/fr/ru home:166 连接词形式 (`4 a 5 paredes` → `4 a 6 paredes` 等)、fa home:27 `PSI 4-5` 前缀序、ru home:108 `4–5 фунтов`、ru home:166 `4–5 стенок PSI`、site/about.yaml:39 + keystatic/about.astro:65 裸值 `'4–5'`→`'4–6'`、specs.astro:449 行尾折行 `rigid walls at 4–5`。另 lv home:166 藏 **U+00A0 不换行空格** 变体 (`4–5\u00A0PSI`) 单独修复 (保留 nbsp 风格)。
- **语义修正 (6 PSI = 工作上限)**: 37 份 about.yaml "Pressure testing **above** the rated 4-5 PSI working range" → "**at the top of** the rated 4-6 PSI working range" (EN + 36 语言同句英文); procurement-guides "tested above its operating point" → "tested at the top of its operating range" + "Why test at 6 PSI" Q/A 重写; drop-stitch-core.md "never inflation targets" 句删除改为 QC-hold 表述; 5 个 PDP mdx 安全段 "safety ratings, not inflation targets" 矛盾措辞删除 ("are factory safety ratings"); hot-tub ×2 QC 行 → "factory quality-control hold at the top of the 4–6 PSI operating range"。
- **排除项**: TECH.md 历史记录、docs/ai-visibility-baseline.md (dated 快照)、`.cache/` 翻译缓存、`src/i18n/generated/` (构建再生成)、`Ø 4–5 m` 尺寸 / `4–5 tonnes` / guides.ts 4.5 PSI 热天例子等非压力 4–5 保留。
- **收尾阻塞**: 原版 PDF 数字修订 (5–8/15 → 4–6/8) 待工厂提供修订版手册 (页面披露已足够, 不阻塞发布); 其余同 19.8。

### 19.10 泰文分词低估修复 + 全站孤儿扫描 (2026-11-11, `ec33c87`)

全站审计发现的**真 SEO bug**: 泰文无词间空格, 全站 6 处空白分词器系统性低估泰文页 ~4-5 倍:

- **实锤受害页**: `th/disclaimer` 97 空白词 < `minWordsToIndex: 100` 阈值 → 被 `generate-sitemaps.mjs` 逐出全部 sitemap, 但页面 index,follow + 自指 canonical — 可索引却无 sitemap 入口, 孤儿化。实际内容 467 词当量 (2241 泰文字符)。
- **险情**: th/privacy (135) / th/terms (150) 距运行期 noindex 兜底线仅 32-50 词余量。
- **修复口径 (6 处统一)**: `words = 非泰空白 tokens + floor(泰文字符 / 5)`; 折算率 5 字符/词由四个实页校准 (terms≈5.22 / privacy≈5.36 / disclaimer≈5.84 / products≈3.73)。落点: `generate-sitemaps.mjs` (sitemap 纳入, 决定性) / `seo-suppress.ts` (运行期 noindex) / `05_ci_gate.py` (C 测量) / `i18n-wordcount.mjs` / `analyzer.ts` / `news-render.ts` (readingTime)。
- **孤儿判定法**: index,follow + canonical 自指 + 不在任何 sitemap。扫描脚本路径归一化两踩坑 (sitemap `<loc>` 去协议域名后仍带前导斜杠, 与 dist 相对路径不匹配 → 536 全量误报)。修复后全站唯一孤儿即 th/disclaimer, 修复后归零。
- **验证**: sitemap 536→537 URL (th/disclaimer 回归, hreflang 38 条往返齐全); gate 告警 108→105 (3 条泰文假 C 消除; 余 th/products 284 词为准确计数, 与各语言产品列表页 220-380 词同特征, warn-only)。CI 三 workflow 全绿; 生产复验 sitemap 含 th/disclaimer + 页面 200/自指/无 noindex。

### 19.11 全站质量审计收尾轮 (2026-11-11, `4bce3f6`)

泰文修复后的全站扫描结果（662 页 dist + 生产复验）：

- **乱码**：dist 662 页 U+FFFD 扫描 0 命中。
- **JSON-LD**：3314 个 ld+json 块全部 JSON.parse 通过，0 解析失败。
- **图片 alt**：3258 个 `<img>` 全部带 alt，0 缺失。
- **孤儿页**：修复后全站 0（唯一孤儿 th/disclaimer 已随 19.10 回归 sitemap）。
- **遗留路由**：`/blog/`、`/factory/`、`/de/blog/` 生产 404 —— 2026-10 boat-content 清理的既定设计（不重引入 LEGACY_REDIRECTS），内部链接 0 断链，维持现状。
- **安全响应头**：`public/_headers` `/*` 块新增 `Strict-Transport-Security: max-age=31536000; includeSubDomains`（刻意**不带 preload**，需全子域 HTTPS 审计后再加；CSP 刻意缺席——Astro 内联 islands + Turnstile + CF beacon 需 nonce/hash 改造，记录为延后项）。生产已验证响应头生效。原有 nosniff/XFO/referrer-policy/permissions-policy 齐全。
- **CI 教训**：`72653e3` Build & Deploy 因 TECH.md 未过 prettier 失败（`Add-Content` 追加后必须 `npx prettier --write TECH.md` 再提交）；下一个提交已修复。另：docs-only 提交也会跑完整 deploy 流程。

### 19.12 gate PDP 误报治理：确定性词典覆盖检查 (`710386b`)

gate 报告中 25 条 `[X]` "内容仍是英文"（12 个拉丁语言 × 3 个 PDP：az/et/hu/id/lt/lv/ms/sk/sl/tl/tr/uz 的 hot-tub-round / hot-tub-square-rect / rectangular-drop-stitch-pool）经全量核查**全部为 langdetect 误报**：

- `product-mdx.l10n.json` 36 语言 × 38 块（53 源块去重，2 个 MDX 表格块设计保持 EN）全部真翻译；
- id/ms/hu/uz 渲染正文人工抽查均为纯目标语言；
- 误报机理：langdetect 对这 12 语言模型弱，gate 正文样本（title+h1+前 1200 字符）混入 frontmatter EN 规格表（Shape/Model/Wall thickness…全语言统一 EN 渲染）后检测翻转为 en（conf 0.42-0.9）；扩大采样窗口则部分语言翻转为近亲误判（et→fi、tl→pt、lt→pl、sk/sl→cs），更不可用。

**修复**：A 检查对 PDP 正文改用确定性词典覆盖判定——`localizeMdxBody` 逐块查词典，**源块全覆盖 = 正文机械性全翻译**。gate 启动时加载 5 个 PDP MDX 非表格块 + 词典：全覆盖 → 跳过正文统计检测（仅保留 title/h1 单独校验）；有缺口 → 确定性 `[X]`（精确到块数）+ 统计检测照跑作补充。结果：告警 105→80，`[X]`/翻译缺口清零，阻断 0；剩余 80 条全为 `[C]` 薄内容（产品列表页 220-290 / 法律页 290-394 / 计算器 243 / ai-answer-center 159 等，全语言结构性特征，warn-only 设计内，非缺口）。

### 19.13 全站默认 og:image (`0dab689`)

审计发现**首页（根 + 37 语言）及全部无图页无 og:image**——社交分享（WhatsApp/Facebook/LinkedIn）无预览图。根因：`Metadata.astro` 的 `defaultOgImage` prop 与 config 管线俱在，但 `config.yaml` 无 `metadata.openGraph` 节，lodash merge 后 `images: []`，`buildOpenGraph()` 返回 undefined。

**修复**：`config.yaml` `metadata.openGraph.images[0]` 指向现有工厂图 `round-grey-pool-1.webp`（绝对 URL → `adaptOpenGraphImages` remote 分支原样使用，与既有 228 个页级 og 图行为一致）。merge 链保证页级图照常覆盖默认（PDP og 验证未污染），twitter card 由 `summary` 自动升 `summary_large_image`。

**结果**：og:image 覆盖 228→602/662 页；余 60 页全为 noindex（keystatic 管理页/重定向壳）；可索引页缺图 0。生产已验（首页 og:image 200 image/webp）。附带核查：og:image 本地资产 5 个全部存在；JSON-LD 类型分布健康（Product 114/ProductGroup 76/Article 38/BreadcrumbList 396/FAQPage 364，PDP 全带 Product 载荷）；search-index.json 65 条合法；`/news/` 与 rss.xml 为 news-worker 动态渲染（D1 无新闻时 0 items 属内容状态非接线缺陷）。

### 19.14 结构审计：hreflang 互惠全量核查 + 根 /terms/ 解除抑制 (`9b5e643`)

全站结构审计（662 页 dist 静态图分析，非抽样）：

- **hreflang 互惠**：8898 对 alternate 全量核查（规则：P 声明 L→X 时 X 须自指 L→X，簇内互指含自指的 Google 规范）。发现 **36 条 HREFLANG_TO_NOINDEX**——36 个 `{lang}/terms/` 页的 hreflang en 与 x-default 指向 noindex 的根 `/terms/`（hreflang 目标必须可索引，规范违规）。
- **根因**：`seo-suppress.json` 与 `sitemap-exclude.json` 双配置 `paths: ["/terms"]` 均源自初始提交（34 语言时代遗留）；36 个本地化 terms 页全部可索引在册，姊妹法律页 `/disclaimer/` 从未被抑制——不对称为遗留非决策（TECH.md 无任何 /terms noindex 决策记录，prod-smoke 无相关断言）。
- **修复**：双配置 `paths` 清空（regex 不动）。根 `/terms/` 转 index,follow 自指 canonical 并入 sitemap（537→538 URL）；`/en/terms/` 维持 noindex 镜像 canonical→根（同 /en/disclaimer/ 模式）。生产验证：/terms/ 200 indexable、sitemap 538、de/terms 的 en-alt 目标 200。
- **gate**：0 阻断 / 81 告警（+1：`[C] /terms/ 295 词`——法律页薄内容与 /disclaimer/ 381 同特征，warn-only）。da/no terms 重复 title `[E]` 为存量（两种语言法律术语同用 "Vilkår og betingelser"，hreflang 正确无碍）。
- **canonical 链**：607 页全查无链（A→B→C）/无 404 目标；4 条良性残留（404 页 canonical、keystatic 相对 canonical、en/search 镜像→noindex search——均设计内）。
- **审计脚本坑**：URL 归一化前导斜杠 bug 本轮第三次出现（canonical/hreflang 绝对 URL 去域名后带 `/`，与 dist 相对键不匹配）——662 页全图分析前必须统一归一化。

### 19.15 内链图可达性审计 + footer Disclaimer 接线 (`d76cdae`)

662 页 dist 全量内链图分析（BFS 自根页，区别于 sitemap 孤儿——链接孤儿 = sitemap 在册但无内链入链，Google 抓取优先级受损）：

- **发现**：37 个 `/disclaimer/` 页（根 + 36 语言）**零内链入链**——footer secondaryLinks 有 Terms/Privacy/Returns & Warranty 但从未接线 Disclaimer。纯接线缺口：`nav.disclaimer` 翻译 40/40 生成 ui 文件全在（de "Medizinischer Haftungsausschluss"、th "ข้อจำกัดความรับผิดชอบทางการแพทย์" 等），Footer navTextMap 也早有 `'Medical Disclaimer': 'nav.disclaimer'` 映射。
- **修复**：`navigation.yaml` secondaryLinks 补 Medical Disclaimer → `/disclaimer/`。生产四语言（en/de/th/ar）footer 链接验证全部本地化生效。
- **结果**：链接孤儿 45→8；**537/537 真实 HTML sitemap 页全部经内链可达**，最大爬深 3 层。余 8 = 7 个 sitemap XML 机器文件（robots.txt 引用，非 HTML 链接对象）+ `/ai-answer-center/`（AI 面向端点，经 llms.txt + sitemap + geo-intent 发现，刻意不入人类导航——若未来要人类入口，建议从 /faq/ 或 /support/ 接线）。
- **附带核查**：canonical 链 607 页 0 链/0 死目标；/en/ 镜像内链 40 条全部来自 /en/ 页自身导航（无害）；404 页/keystatic 相对 canonical/search 镜像 4 条良性残留维持不变。
- **方法论**：链接图 BFS 用 dist 静态 HTML 抽取（`<a href>` 全量），内链含 noindex 页作爬取路径；sitemap 页集来自 dist 7 个 sitemap `<loc>`。

### 19.16 pool.docx 优化轮：Finder Engine 2 / 对比页容量 / Compliance 页 / 12 篇新内容 (`57710ce`)

外部优化审计文档（`pool.docx` 12 节）实施轮。前序会话已完成 Finder v2 骨架、retailSets dimsKnown 诚实降级、business candidates 等项；本轮补齐剩余缺口：

- **Pool Finder Engine 2（§5）**：`find-your-pool.astro` 接入 `pool-catalog.ts` SSOT——`parseCatalogFit`（"Ø 2 × 0.5"/"3 × 2 × 0.8" 解析）+ `modelById` Map；全部 14 个 setup 填入真实目录型号 ID（对 48 SKU 逐一校验）；业务卡片渲染 per-model 表（Item/Size/Wall/FOB\*）+ `data-models` JSON；`renderWhy` 命名精确适配型号含 FOB；CTA prefill 携带 items 列表；个人路径 banner 指向工厂全尺寸范围（Ø 2–10 m）。
- **对比页数据补齐（§4）**：Setup Time getter 断裂修复（`specGetter('setup')`→`specGetter('inflation')`——spec label 为 "Inflation time" 接线断裂而非数据缺失）；新增 Dimensions（size range）、Water Capacity（hot-tub-round ≈2,500 L）、Heater 行；`estimateVolumeLiters()` 几何容量估算；工厂 48 SKU 交互表新增 "Est. volume (L)" 列。
- **Compliance 页（§8）**：新建 `/compliance/`——四类声明严格分离（产品符合性 CE/EN 16582-1、设计参考标准 ASTM F2666、材料合规 REACH/RoHS/Prop 65、工厂管理认证 ISO 9001:2015 SGS + BSCI amfori），每类含 "Not a claim that" 反向声明；证书有效期不编造（按需提供现行版本）。quality-control 页 Related B2B 加入口。
- **12 篇新内容（§6）**：guides.ts +10 篇消费级（小院选型/3-4-5m 对比/圆方对比/4m 容量/地上池对比/冷水浴选型/SPA vs 硬质浴桶/加热成本/过滤泵选型/壁厚解析）+ procurement-guides.ts +2 篇 B2B（glamping 度假村采购、泳池品牌创业）——全部引用真实目录数据（48 SKU 尺寸/FOB/壁厚/1 t/m³）。
- **分类页框架（§2）**：products/index.astro 尾部新增 B2B framing 条（Full Factory Collection → /products/specs/、Customizable → /oem-odm/、Commercial → /commercial-pools/）。
- **llms.txt 手动同步**（铁律）：12 条新条目 + Markdown Endpoint Index 计数 17→27 / 6→8。
- **验证**：build 675 页 0 断链/断资产/hreflang；gate PASS；check 全绿；CI 三工作流 ALL_GREEN；生产 8 页 + llms.txt 全部验证 200 + 标记命中（compare "Est. volume"、finder "data-models"、products "Full Factory Collection"）。
- **后置验证（`df71e80`）**：内链图 BFS 复核——558 sitemap 页 550 可达，孤儿仍为已知 8 条（7 个 XML sitemap 机器文件 + ai-answer-center），13 个新页全部有内链入链，爬深 3；hot-tub-round dist 页确认含 §8 要求的零售/批发双渠道价格澄清（"Online price for the fixed retail set (SKU FZ-SPA-RND) — single-piece purchase. FOB Qingdao wholesale pricing ... listed separately"）。
- **遗留**：蓝/灰零售 SKU 尺寸 12 字段（dimsKnown=false）、灰款 +$100 说明、RS2018 实拍、加热器兼容清单、D1 新闻内容、B2B 产能数据——均业务侧阻塞，不编造。
- **fast-follow（docx §4 P1）**：对比页"勾选 2-4 款并排比较"交互升级未做——现有 48 SKU 筛选表已覆盖核心选型场景，若实施建议在 compare.astro 工厂表上增加 checkbox 选择 + 侧边对比栏（数据源同 `pool-catalog.ts`，无新数据债）。（已于 19.17 实施）

### 19.17 对比页勾选比较工具（docx §4 P1 fast-follow 落地）

`compare.astro` 工厂 48 SKU 交互表新增"勾选 2-4 款并排比较"（19.16 记录的 fast-follow，无新数据债——属性直接从行单元格读取）：

- **表格**：新增首列 "Pick" checkbox（48 个，`aria-label="Compare {item}"`）。
- **浮动选择条**：`data-compare-bar` 固定底部，实时显示 "n of max 4 sizes selected"；勾 1 款提示 "pick at least 2" 并禁用比较按钮；尝试勾第 5 款自动回退并提示 "Maximum 4 sizes"。
- **并排比较面板**：`data-compare-panel` 按 7 个属性行（Item/Series/Size/Wall/Est. volume/Packed weight/FOB USD）× 所选 SKU 列渲染，DOM 逐元素构建（无 innerHTML 注入面），末行 CTA → /request-quotation/；"Close"/"Clear" 均可收起。
- **实现要点**：全部逻辑在既有 IIFE `<script>` 内（无顶层 return）；属性单元格用索引读取（checkbox 列占 index 0，ATTRS 常量表驱动）；系列筛选与勾选状态互不干扰。
- **验证**：dist 49 处 `data-compare-check` 标记（48 checkbox + script）；build 0 断链；gate PASS；prettier/eslint/astro check 全绿。

### 19.18 prod-smoke 全量回归 + de PDP 标记本地化修正 + 瞬时部署故障处置 (`a3dce73`)

对比页工具落地后对生产环境跑完整 `scripts/prod-smoke.mjs`（60 项发布门禁），发现并处置两项：

- **59/60 → 标记过时（非内容回归）**：`/de/products/round-blue-drop-stitch-pool/` 检查断言英文 FAQ 标记 "cost to run"，但 faq.l10n Round 3（2026-11）已把 ai_faq 问题本地化为 "Was kostet der Betrieb?"——本地化页正确渲染德语 FAQ + FAQPage JSON-LD，英文标记自然消失。修正：检查标记改为德语译文，回归描述扩展为 "empty-array fallback + faq.l10n coverage"。修正后 60/60 全过。教训：**prod-smoke 对本地化页断言英文内容属时间炸弹**——l10n 字典更新后必须同步检查标记（其余 /de/ 检查用属性/JSON-LD 标记，安全）。
- **CI Build & Deploy 瞬时故障**：`a3dce73`（仅改 scripts/prod-smoke.mjs，不影响产物）部署步骤报 "Received a malformed response from the API"（wrangler 收到 Cloudflare Pages API 异常响应）——确认基础设施瞬时故障而非代码问题。处置：下载 CI 日志定位失败步骤 → API `rerun-failed-jobs` 重跑 → 绿。AI Index (Vectorize) 对该 SHA 显示 skipped 属路径过滤设计行为（scripts-only 变更）。
- **CI 重跑操作记录**：GitHub token 可经 `git credential fill`（Windows Credential Manager，`manager` helper）取得用于 Actions API（日志下载/rerun）；重跑后轮询 run conclusion 而非重新推送。

### 19.19 破坏性试验报告发布：/destructive-testing/ 页 + 4 份 PDF (`2463990`)

业务侧交付 `充气泳池破坏性试验` 文件夹（4 份分阶段试验报告 PDF + 1 份中英对照 SOP + "Felizbay 零售价.xlsx" + 说明 txt）的落地轮：

- **价格表核实（不改动）**：'零售价.xlsx' 实为工厂 FOB 报价单（内嵌标题 "Quotation sheet of Felizbay / Price based on: 20pcs"）。解包比对确认与已发布的 `public/files/felizbay-wholesale-price-list.xlsx` **内容一致**——53 个数值价格单元格全同，唯一差异是表头 "USD"→"Price/USD"；48 SKU + 5 配件数据本已全量收录（/products/specs/ 渲染 + /wholesale/ 可下载）。业务确认后不改动。注意 xlsx 原始单元格价格与产品行存在错位（S3010=137.96 即 3.4$/kg 物理不合理），站内 `pool-catalog.ts` 才是 SSOT。
- **新页 `/destructive-testing/`**：根级 EN-only（与 compliance/quality-control 同模式，不进 [lang]）。内容全部来自报告说明 txt，零编造：样品 400×300×120 cm / 20 cm 壁厚 / 高频热合·热风焊接 + 双组分聚氨酯冷粘；关键数据带（25.4 PSI 爆破极限 / 3.18× 8 PSI 最大工作压力 / 10,810 L 110% 超载 / 72 h / 500 次摆锤 / 最大外倾 5.6°）；三阶段卡片（RPT-FB-QC-20261113-S1 原材料、S2 热合超压爆破、S3 满载静水压+动态冲击）+ 最终结论报告卡（FINAL：8 项指标汇总 / 安全裕度评估 / 量产放行），每卡 PDF 下载；"How to Read These Results" 边界框（破坏裕度≠操作目标、日常仍 4–6 PSI、非产品认证、超载事件是一次性破坏性事件）；sr-only `data-ai-block="destructive-testing"` 进 AI 语料。
- **PDF 命名**（public/files/ 小写连字符）：`felizbay-destructive-test-{stage1-raw-material, stage2-welding-burst, stage3-full-load, final-report}.pdf`；SOP（14 页工厂实操规程）按业务决策**不发布**。
- **互链**：compliance Related Pages、quality-control Related B2B、products/specs #pressure 区块（"measured the structure to burst at 25.4 PSI — 3.18× ..."）。
- **llms.txt**：B2B & Manufacturing 区块新增条目（quality-control 行后）；无 markdown 端点（与 compliance/quality-control 同级模式），Markdown Endpoint Index 计数行不变（"2 standalone tech pages" 指 standalone-pages.ts，未动）。
- **prod-smoke +5 → 65 项**：页面断言（25.4 PSI / 10,810 L / RPT-FB-QC-20261113 / final-report.pdf 链接）+ 4 份 PDF `application/pdf` 断言；本地回归 65/65 全过。
- **验证**：build 676 页 0 断链/断资产/hreflang；`npm run check` 全绿（astro check 642 文件 0 错误）；CI 三工作流 ALL_GREEN；生产验证页面标记 + 4 PDF（经 assets.felizbay.com R2 301 重定向，200/application/pdf，字节数与源一致）+ 三处互链 + llms.txt 条目全部命中。推送过程见 §11.27（HTTP/1.1 修复）。

---

## 20. 业务交接：询盘回访模板与待解锁清单 (2026-11-14)

本章为业务侧（销售/管理员）提供两份可直接使用的材料：**询盘回访邮件模板**（配合 `/keystatic/contact-submissions` 使用）与**待解锁数据项的实施方案映射**。技术侧红线：所有未发布数据（蓝/灰零售 SKU 尺寸、灰款溢价原因、加热器兼容清单、B2B 产能）**一律不得在回访中口头补造**，按模板的边界话术处理。

### 20.1 询盘回访邮件模板（EN，三场景）

回访邮件统一规则：Reply-To 指向询盘提交者（contact-worker 已自动设置通知邮件 Reply-To）；24 小时内首次回复；落款含官网与 specs 表链接；对未发布数据使用固定边界话术 "confirmed at order"（下单时确认），不得报任何未公开数字。

#### A. 零售询盘（个人购买，Subject 含 pool/price/single）

```text
Subject: Re: Your Felizbay pool inquiry — {客户姓名}

Hi {First Name},

Thanks for reaching out about our pools.

For single-piece online purchases we currently offer three retail sets:
- Round Blue Pool (SKU FZ-POOL-RND-BLUE) — $299
- Round Grey Pool (SKU FZ-POOL-RND-GREY) — $399
- Round SPA Tub (SKU FZ-SPA-RND, Ø 2 × 0.8 m with seats) — $499

Each set includes a 1000W electric air pump, repair kit and storage bag;
setup takes about 10 minutes.

Two resources that answer most questions before you buy:
- Find Your Pool advisor: https://felizbay.com/find-your-pool/
- Buying guides (sizes, costs, heating, filters): https://felizbay.com/guides/

{如客户询问具体未发布规格，插入：}
The exact specs for that set are confirmed at order time — I will send
the full datasheet together with your order confirmation.

Happy to help you pick the right size for your space — just reply with
your available area and who will be using the pool.

Best regards,
{署名}
Felizbay — https://felizbay.com
```

#### B. 批发 / OEM 询盘（含 Company、MOQ、wholesale、private label、logo）

```text
Subject: Re: Your wholesale inquiry — {公司名}

Hi {First Name},

Thanks for your interest in working with Felizbay.

Our wholesale terms at a glance:
- FOB Qingdao, USD, price basis 20 pcs per item, MOQ 20 pcs per item
- Full 48-SKU factory specs and price list: https://felizbay.com/products/specs/
- OEM/ODM: custom sizes, colors, logo printing and packaging

Useful reading for your evaluation:
- How to choose a drop stitch manufacturer: https://felizbay.com/guides/how-to-choose-a-drop-stitch-pool-manufacturer/
- How much does a wholesale pool cost: https://felizbay.com/guides/how-much-does-a-wholesale-drop-stitch-pool-cost/
- Compliance & documentation (CE/EN 16582-1, ASTM F2666 design reference,
  REACH/RoHS/Prop 65, ISO 9001:2015 + BSCI): https://felizbay.com/compliance/

Next steps: let me know your target sizes, estimated annual volume and
destination market, and I will send a quotation with a container loading
plan. Pre-production samples with 24-48h pressure-drop test reports are
available before you commit.

Best regards,
{署名}
Felizbay — https://felizbay.com
```

#### C. Glamping / 度假村 / 商用场景询盘（含 resort, glamping, rental, hotel, commercial）

```text
Subject: Re: Your {resort/glamping} pool inquiry

Hi {First Name},

Thanks for reaching out — hospitality deployments are one of our main
B2B use cases.

We published a dedicated sourcing guide for operators:
https://felizbay.com/guides/inflatable-pools-for-glamping-resorts/
It covers product selection (Ø 2–10 m swim pools plus insulated soaking
tubs), site preparation, seasonal logistics and supplier evaluation.

One important boundary to plan around: our pools are built and tested to
residential-family standards (design reference ASTM F2666; EN 16582-1 in
Europe). For paid-guest commercial use, please verify local requirements
(insurance, fencing, water treatment, occupancy rules) for temporary
fabric pools at your site before ordering — your insurer and municipal
authority are the right first calls.

If you share your site plan (number of pitches, water feature ideas,
deployment calendar), I will match models from the 48-SKU factory list
and quote FOB with a loading plan.

Best regards,
{署名}
Felizbay — https://felizbay.com
```

### 20.2 待解锁数据项 → 实施方案映射

| 待解锁项                   | 业务提供物                                                     | 接线位置                                                                              | 实施动作                                                                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 蓝/灰零售 SKU 尺寸 12 字段 | 外径/内径/高度/壁厚/容量/装运毛净重/箱规                       | `src/content/products/round-{blue,grey}-drop-stitch-pool.mdx` specs 数组              | 补 specs 条目（label 遵循现有命名：Size range/Wall thickness/Water capacity…）；compare.astro 的 dimsKnown 分支自动消失；find-your-pool retailSets dimsKnown 置 true 并填 dims；generate-merchant-feed 门槛（price×100==unitAmount）需同步 Stripe 后台 |
| 灰款 +$100 溢价原因        | 一句业务口径（材料/工艺/定位）                                 | `src/data/products.ts` 灰款 "difference between the grey and blue" FAQ + PDP 文案     | 用业务口径替换/扩写现有 FAQ 答案（当前仅 "premium finish + optional cover"）；compare 页如新增价格说明行需同步                                                                                                                                         |
| RS2018 零售实拍            | 实物照片（多角度+盖子）                                        | `public/images/pools/`（WebP 1600px q82）+ `src/data/site/image-dimensions.json` 重建 | 新图命名建议 `hot-tub-round-retail-{1..n}.webp`；build 自动重建尺寸注册表；替换 hot-tub-round.mdx gallery                                                                                                                                              |
| 加热器兼容清单             | 兼容加热器型号/功率档位                                        | `src/content/products/hot-tub-round.mdx` 新增 spec + compare.astro Heater 行文案      | 替换当前 "compatibility confirmed per order" 边界话术；glamping 指南 FAQ 同步                                                                                                                                                                          |
| 配送数据                   | 零售发货时效/运费/覆盖范围                                     | 新增 shipping spec 或 support 页 FAQ                                                  | Contact.astro/PurchaseAssurance 相应行同步                                                                                                                                                                                                             |
| B2B 产能数据               | 月产能/日产能/旺季排产                                         | `src/config/facts.json` + B2B 页                                                      | 走 facts.json SSOT 渲染，禁止页内硬编码                                                                                                                                                                                                                |
| D1 新闻                    | 管理员审核 `docs/news-drafts/*.md` 后经 `/keystatic` News 发布 | news-worker D1                                                                        | 草稿已按 D1 schema 字段备好（title/slug/category/tags/excerpt/body/metadata）                                                                                                                                                                          |
| Stripe 开通                | 账户激活 + 后台 SKU 与零售价一致                               | CI secrets + `CHECKOUT_ENABLED` flag                                                  | 开通后跑 generate-merchant-feed 校验（price×100==checkout unitAmount 门槛）+ prod-smoke merchant-feed 检查                                                                                                                                             |
| Aquafarer 法律核实         | 商标/实体状态结论                                              | `src/config/facts.json` 相应字段                                                      | 按结论修正或删除引用                                                                                                                                                                                                                                   |
| 原版说明书 PDF 修订        | 修订版 PDF 源文件                                              | `public/files/` + `/user-manual/` 页链接                                              | 保持文件名与页面链接一致（loadContent/链接三处同名铁律适用于文件同理）                                                                                                                                                                                 |

### 20.3 新闻稿草稿位置

`docs/news-drafts/2026-11-14-*.md`（3 篇：12 篇新指南、Compliance 页、对比工具升级）——均为真实站点更新，字段对齐 D1 news schema，管理员审核后经 `/keystatic` → News → New Post 粘贴发布，发布后 rss.xml 由 news-worker 自动生效。
