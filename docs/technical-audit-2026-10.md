# 技术审计与询盘测试记录（2026-10-21）

> 对应《任务2》整改项：
>
> - P1：**完成全站技术爬虫审计 —— 检查状态码、canonical、hreflang、索引指令和内链**
> - P1：**检查 Contact 表单和询盘追踪 —— 测试提交、邮件送达、CRM 记录和有效询盘事件**

本文档为 2026-10-21 审计轮次的完整记录，作为后续复测的基线。

## 1. 技术爬虫审计结果（48/50 项通过）

### 1.1 通过项

| 检查项                                                     | 结果                                          |
| ---------------------------------------------------------- | --------------------------------------------- |
| http → https 301                                           | ✅ 全站 301                                   |
| sitemap-index + 7 个子 sitemap                             | ✅ 共 279 个 URL，全部可解析                  |
| canonical（抽样 10 页：首页/产品/指南/About/FAQ 等）       | ✅ 均为自引用绝对 URL                         |
| robots.txt                                                 | ✅ 200，AI 爬虫明确放行                       |
| 每页 H1 唯一                                               | ✅ 抽样 10 页均 1 个 H1                       |
| hreflang 互链 + x-default                                  | ✅ 抽样解析，双向映射完整                     |
| llms.txt / llms-full.txt（30KB）/ entity.json / ai-sitemap | ✅ 全部 200                                   |
| merchant-feed.xml（GMC）                                   | ✅ 3 个可购 SKU，门禁校验通过                 |
| JSON-LD @graph 实体枢纽                                    | ✅ 单一 Organization/Brand/Person，无重复实体 |

### 1.2 既定设计（非缺陷，勿当问题上报）

- **`/de/` 等部分语言页 canonical → EN 根页面**：由 `scripts/fold-untranslated-canonical.mjs` 按翻译完整度折叠，G 类检查允许。
- **跨语言 `/en/` 镜像页**：由 `mirror-root-en.mjs` 生成，属 URL 策略的一部分。

### 1.3 发现并已修复的缺陷（P6，commit `e9d050c`）

**产品页移动端性能不达标**：Lighthouse perf 46，LCP 15.3s。根因是 hero 大图未压缩（`round-blue-pool-1.png` 2109KB，2048×2048）。

修复：`public/images/pools/` 下 15 张 >100KB 图片转 WebP（1600px q82），18.5MB → 0.85MB（-97%）；全库 215 处引用同步替换。

| 指标（产品页移动端） | 修复前 | 修复后（线上） | 修复后（本地） |
| -------------------- | ------ | -------------- | -------------- |
| Perf                 | 46     | 67             | 84             |
| LCP                  | 15.3s  | 3.5s           | 1.8s           |
| CLS                  | 0      | 0              | 0              |
| TBT                  | 1140ms | 1006ms         | 587ms          |

遗留可选项：TBT ~1s（首页 780ms / 产品页 ~1s），来源为前端 JS 执行，属后续独立优化项。

### 1.4 TBT/LCP 整改（2026-10-28 完成，commit `756c26b`）

上表遗留项经 Chrome trace 取证后修正归因并修复：

- **产品页 TBT 2310ms（本地 Lighthouse 移动端复测）**：非 JS 执行（Script Evaluation 仅 230ms），真凶为 `Inter Variable` 字体 `font-display: swap` 在 FCP 后触发 3 次全页 Layout（180/640/405ms）。修复：`Layout.astro` 预加载 woff2 子集（latin 恒定 + 按语言 latin-ext/cyrillic/greek），字体先于首绘就位。
- **首页 LCP 7.6s**：hero 首图 441KB JPG（pool-ideas 11 张共 3.1MB 未压缩）。修复：转 WebP 1280px q75（3.1MB → 1.4MB，首图 441KB → 201KB）。

| 指标（Lighthouse 移动端，本地） | 整改前            | 整改后                       |
| ------------------------------- | ----------------- | ---------------------------- |
| 首页 perf / LCP / TBT           | 54 / 7.6s / 900ms | 76–91 / 1.1–2.2s / 260–930ms |
| 产品页 perf / TBT               | 69 / 2310ms       | 74–75 / 510–840ms            |

线上实测（2026-10-28）：首页 perf 81（TBT 600ms / LCP 2.5s / CLS 0）；产品页 perf 67（TBT 970ms / LCP 3.5s / CLS 0）。线上与本地差距主要来自 `/images/*` → `assets.felizbay.com` 的 301（Cloudflare 面板 Redirect Rule，仓库外配置，LCP 图多 1 个 RTT）及真实网络延迟；CWV 以 Search Console 真实用户数据为准。

View Transitions 保留：对照实验显示禁用 ClientRouter 仅省 ~110ms TBT，不值得牺牲 UX。剩余首页 TBT 为 hero 图解码 + 初始 Layout 的固有成本。

## 2. Contact 表单询盘测试结果（2026-10-21）

对 `https://felizbay.com/api/contact`（contact-worker）执行分层线上测试：

| #   | 层               | 测试方法                        | 预期                         | 实际                                              | 结果 |
| --- | ---------------- | ------------------------------- | ---------------------------- | ------------------------------------------------- | ---- |
| T1  | 字段校验         | 缺 lastName 的 JSON POST        | 400                          | 400 `First and last name required`                | ✅   |
| T2  | 垃圾词过滤       | 含 casino/viagra 的消息         | 400                          | 400 `Submission rejected`                         | ✅   |
| T3  | 蜜罐             | 填充隐藏字段 email_confirm      | 200 假成功（不写库不发邮件） | 200 假 UUID                                       | ✅   |
| T4  | Turnstile 服务端 | 有效字段 + 无 token             | 400                          | 400 `Captcha verification failed` → secret 已配置 | ✅   |
| T5  | Admin CRM 面向   | 未鉴权 GET /api/admin/inquiries | 401                          | `{"error":"Unauthorized"}`                        | ✅   |

前端确认：Turnstile 组件已渲染（sitekey `0x4AAA...`）、蜜罐字段存在、提交指向 `/api/contact`。

代码审查确认（未线上触发，避免污染数据）：

- 限流为 D1 全局固定窗口（5 次/IP/小时，`rate_limit` 表），429 + `Retry-After`。
- 附件门禁：扩展名白名单 + 20MB 上限 + magic-number 嗅探后才入 R2。
- 邮件经 Resend 发送，`Reply-To` 设为提交人。

### 2.1 真实提交验证（2026-10-21 完成）

首次人工提交出现"页面显示成功但无邮件、无 Resend 记录"——排查确认根因为**蜜罐误伤**：浏览器/密码管理器无视 `autocomplete="off"` 自动填充了隐藏字段 `email_confirm`，服务端按机器人处理（假成功、不写库、不发邮件）。

修复（commit `8be025a`）：页面自身 JS 从提交数据中删除蜜罐字段并清空 DOM 输入框；直接 POST 的真机器人仍被服务端蜜罐拦截。修复上线后重新提交：

| 步骤               | 结果                                      |
| ------------------ | ----------------------------------------- |
| Turnstile 过码提交 | ✅ 成功                                   |
| Resend 邮件送达    | ✅ 收到通知邮件（`Reply-To` 为提交人）    |
| D1 记录            | ✅ 隐含验证（代码顺序 D1 先插、邮件后发） |
| Admin 后台登录     | ✅ 已恢复                                 |

### 2.2 www → apex 301 验证（2026-10-21 完成）

Cloudflare Redirect Rule 配置后实测：

| 请求                                       | 状态 | Location                                |
| ------------------------------------------ | ---- | --------------------------------------- |
| `https://www.felizbay.com/`                | 301  | `https://felizbay.com/`                 |
| `https://www.felizbay.com/products/specs/` | 301  | `https://felizbay.com/products/specs/`  |
| `https://www.felizbay.com/de/contact/`     | 301  | `https://felizbay.com/de/contact/`      |
| `https://www.felizbay.com/api/contact`     | 301  | `https://felizbay.com/api/contact`      |
| `http://www.felizbay.com/`                 | 301  | `https://felizbay.com/`（单跳，无链式） |

路径通配（`$1`）与 http→https 均正常。

### 2.3 R2 旧资产自动清理（2026-10-21 完成）

`scripts/fast-upload-r2.mjs` 增加 prune 步骤（每次 deploy 自动运行）：删除 R2 中位于同步前缀（`data/ images/ files/`）下、但本地 `public/` 已不存在的对象。安全护栏：本地某前缀为空则跳过该前缀；删除数超过 200 直接跳过并告警；prune 失败不阻断部署。P6 遗留的 15 张旧 PNG/JPG（约 18.5MB）由该步骤自动清除。

### 2.4 llms 清单与 AI sitemap 漂移修复（2026-10-31 完成，commit `6aded2e` / `d823bd8`）

排查 rss.xml / llms.txt 收录疑点时发现的 AEO 真实缺口（均已修复并部署）：

- **llms.txt**（AI 知识清单主入口）滞后于 2026-10 内容批次：缺全部 13 篇新 consumer guides、15 个场景页、`/support/`、`/find-your-pool/`、`/returns-and-warranty/`。已补 "Pool Owner Guides"（16 篇）与 "Pool Ideas"（hub + 15 场景）两节。
- **llms-full.txt** 生成器从 `src/data/pages` YAML 原样导出，emit 了 **57 个死链**：37 个 `/home/`（本地化首页路由是 `/{lang}/`，非 `/{lang}/home/`）+ 20 个本地化 `/request-quotation/`（该页仅根路由）。重写 `generate-geo-files.ts` `getPageUrls()` 只 emit 真实路由；guides/pool-ideas 改从 SSOT 数据模块导入（新增内容自动收录）。
- **ai-sitemap.xml**：`AI_TOP_SECTIONS` 为陈旧模板清单（26 条中 19 条不存在，靠 filter 兜底仅剩 6 条）。重写为 20 条现存顶级分区。
- **knowledge-sitemap.xml**：过滤器缺 `/pool-ideas/` 前缀，15 个场景页未收录。已补（24→40 URL）。
- **rss.xml 疑点结论**：非 bug——feed 由 news-worker 服务（D1 驱动，当前空频道 342B），仓库无 `src/pages/rss.xml.ts`（AGENTS.md 过时描述已修正）。
- **防回归**：`npm run smoke` 对 llms.txt / llms-full.txt / knowledge-sitemap 增加 guides+pool-ideas+support 覆盖断言，并新增 `/rss.xml` 与 knowledge-sitemap 专项检查（33→35 项）。

## 3. 剩余人工操作清单

| 事项              | 位置           | 操作                                                          |
| ----------------- | -------------- | ------------------------------------------------------------- |
| AI 平台基线轮次   | 各 AI 平台     | 按 `docs/ai-visibility-baseline.md` 协议执行第 1 轮人工问答   |
| `/keystatic` 后台 | admin 已可登录 | 查看 `/keystatic/contact-submissions` 询盘记录、测试 CSV 导出 |

## 4. 复测建议

- 每季度重跑本文件 §1 的爬虫审计；PSI/CWV 数据以 Search Console 真实用户数据为准。
- 表单改动（字段、worker、限流）后重跑 §2 的 T1–T5。
