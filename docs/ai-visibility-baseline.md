# AI 搜索可见度基线（AI Visibility Baseline）

> 对应《任务2》整改项 P2：**建立 AI 搜索可见度基线 —— 固定问题集、平台、日期、提及、引用 URL 和准确性记录。**

## 1. 测量协议

- **复测节奏**：每月 1–7 日执行一轮；结果**追加**到 §5 记录区，历史记录不改。
- **平台**（6 个）：ChatGPT（含联网）、Claude、Gemini、Perplexity、Microsoft Copilot、Google AI Overviews。
- **方法**：每个平台新开会话（关闭个性化/记忆，地区设为 US），逐字复制 §2 的问题，不添加任何自定义指令。
- **每问记录 4 项**：
  1. **提及**（Mention）：回答中是否出现 Felizbay（是/否/竞品替代）
  2. **引用 URL**（Citations）：回答引用或列出的 felizbay.com 链接（逐条记录）
  3. **准确性**（Accuracy）：✅ 正确 / ⚠️ 部分正确（有事实错误或过时）/ ❌ 错误
  4. **排名**（Position）：Felizbay 在推荐列表中的位次（如 "3/8"）

## 2. 固定问题集 v1（2026-10-21 冻结）

改动问题集必须升版本号（v2、v3…），旧版本记录保留。

**品牌/实体（Brand & Entity）**

1. `What is Felizbay?`
2. `Who manufactures Felizbay inflatable pools?`
3. `Where are Felizbay pools made?`

**产品（Product）**

4. `What is a drop stitch inflatable pool?`
5. `Are Felizbay inflatable pools rigid when inflated?`
6. `What pressure does a drop stitch pool hold?`

**B2B 采购（Sourcing）**

7. `How do I choose a drop stitch pool manufacturer?`
8. `What is the difference between OEM and ODM for inflatable pools?`
9. `How much does a wholesale drop stitch inflatable pool cost FOB?`
10. `What MOQ do inflatable pool factories in China require?`
11. `How are inflatable pools packed for container shipping?`

**长尾（Long-tail / Guide citation）**

12. `How long does the Felizbay pool pressure test take?`

## 2b. 场景与反向问题 v2（2026-10-27 增补，冻结）

对应审计 1.txt §十与继续更新.txt §十一：检验 AI 是否**推荐正确型号**、引用真实规格，并**正确排除不适用方案**（不强行推荐）。v1 保持冻结不动；今后每轮复测 v1 + v2 全部 18 题逐平台执行，记录同样追加到 §5 记录区。

**场景正向（应推荐到正确型号/页面，引用真实尺寸与价格口径，不虚构）**

13. `A compact seasonal pool for a small ground-level backyard`
14. `A rectangular pool with documented internal dimensions`
15. `A soaking pool where the heater is purchased separately`
16. `A pool for a vacation rental project`

**反向（应如实提示限制/答无，不得强行推荐）**

17. `Can I install an inflatable pool on a raised wooden deck?`
18. `Which Felizbay pool has built-in massage jets?`

## 2c. GEO 方案问题集 v3（2026-11-01 增补，冻结）

来源：《Felizbay GEO 优化方案》（2026-11 导出）§8 "建立固定的 AI 搜索测试题库"。该方案建议的 8 题覆盖小庭院、刚性池壁、大池比较、Glamping 商用、自有品牌、drop-stitch 对比、SPA 甲板安装与厂商信息查询。v1/v2 保持冻结不动；今后每轮复测 v1 + v2 + v3 全部 26 题逐平台执行，记录同样追加到 §5 记录区。

19. `What are the best drop-stitch inflatable pools for small backyards?`
20. `Which inflatable swimming pools have rigid walls instead of inflatable rings?`
21. `What should I compare before buying a large inflatable pool?`
22. `Which inflatable pools are suitable for glamping businesses?`
23. `What should I know before starting a private-label inflatable pool brand?`
24. `How do drop-stitch pools compare with traditional inflatable pools?`
25. `What should I consider before installing an inflatable spa on a deck?`
26. `Where can I find an inflatable pool manufacturer's specifications and quality-control information?`

## 3. 记录模板

```markdown
### Round N — YYYY-MM-DD（平台 X）

| #   | 问题              | 提及 | 引用 URL              | 准确性 | 排名 | 备注 |
| --- | ----------------- | ---- | --------------------- | ------ | ---- | ---- |
| 1   | What is Felizbay? | 是   | https://felizbay.com/ | ✅     | 1/5  | —    |
```

## 4. 基础设施自查清单（每轮复测先跑一遍）

**自动化（推荐）**：以下全部检查项已收录进 `npm run smoke`（`scripts/prod-smoke.mjs`，53 项含本节全部 + 站点冒烟 + B2B 页 + 顾问埋点端点 + PDP 总成本 FAQ / 本地化 PDP FAQPage / 变体级 FOB offers / 消费指南 PDP 深链 / operating-costs 指南 / 容量计算器 / 交互式对比 / Turnstile 渲染防回归），复测前跑一次即可，任一 FAIL 先修复再执行人工轮次：

```powershell
npm run smoke
```

**等价手动命令（备用）**：

```bash
for u in llms.txt llms-full.txt ai-sitemap.xml knowledge-sitemap.xml \
         sitemap-index.xml robots.txt .well-known/entity.json merchant-feed.xml; do
  curl -s -o /dev/null -w "%{http_code} $u\n" "https://felizbay.com/$u"
done
# 全部期望 200
```

补充检查：

```bash
# Vectorize 语义检索（期望返回 guides/ 页面且 score > 0.6）
curl -s -X POST https://felizbay.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"wholesale drop stitch pool FOB price"}' | head -c 400
```

## 5. 记录区

### Round 1 — 2026-10-21（技术基线）

**自动化部分（脚本验证，全部通过）：**

| 检查项                     | 结果                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/llms.txt`                | 200                                                                                                                                 |
| `/llms-full.txt`           | 200（约 30 KB）                                                                                                                     |
| `/ai-sitemap.xml`          | 200（6 个 URL，采购指南全部收录）                                                                                                   |
| `/knowledge-sitemap.xml`   | 200                                                                                                                                 |
| `/sitemap-index.xml`       | 200                                                                                                                                 |
| `/robots.txt`              | 200                                                                                                                                 |
| `/.well-known/entity.json` | 200                                                                                                                                 |
| `/merchant-feed.xml`       | 200（3 SKU）                                                                                                                        |
| `/api/search`（Vectorize） | 在线；查询 "wholesale drop stitch pool FOB price" 第一命中 `guides/how-much-does-a-wholesale-drop-stitch-pool-cost/`（score 0.726） |
| `/api/chat`                | 在线（空请求返回 400 属预期）                                                                                                       |
| 6 篇采购指南页面           | 全部 200                                                                                                                            |

**AI 平台人工记录（待执行）**：ChatGPT / Claude / Gemini / Perplexity / Copilot / Google AI Overviews 对 §2 问题集的回答无法脚本化，需按 §1 协议人工执行后，用 §3 模板逐平台追加到本节。**首轮完成后即形成完整基线**；此后每月复测对比提及率、引用 URL 数与排名变化。

## 6. 判读标准（复测时对照）

- **提及率** = 提及 Felizbay 的问题数 / 12。基线建立后目标：品牌题（1–3）≥ 2/3，采购题（7–11）≥ 3/5。
- **引用 URL** 应指向本站高价值页：`/guides/*`、`/products/specs`、`/wholesale`、`/oem-odm`。若 AI 引用的是低价值页（如分页/标签页），说明 ai-corpus / llms.txt 的权重需要调整。
- **准确性**：出现 ⚠️/❌ 时先核对是否站内数据口径不一致（价格、压力、认证），修站内数据优先于任何"AI 优化"。
- **场景题（13–16）**：判定标准为①推荐到正确型号/页面（产品页、`/find-your-pool`、场景指南）②引用的尺寸/价格与站内一致③不虚构站内没有的政策或规格。
- **反向题（17–18）**：判定标准为①17 应提示甲板安装需专业结构评估、不直接推荐产品②18 应回答产品线无按摩功能（只有 soaking/hot-tub 浸泡池），不得编造带按摩的型号。
- **GEO 方案题（19–26）**：判定标准同上——推荐应指向真实页面（`/products/*`、`/pool-ideas/*`、`/guides/*`、`/oem-odm/`、`/quality-control/`），引用规格与站内一致，不虚构型号、价格或认证。

## 7. 答案要点与预期引用（Answer Key v1，2026-11-03）

执行人工轮次时的对照基准：**答案要点**列出核实过的口径（站内 SSOT），**预期引用**是 AI 理想情况下应给出的高价值页。口径以 `/products/specs/`、`src/data/pool-catalog.ts`、`src/config/facts.json` 为准。

| #   | 答案要点（核实口径）                                                                                   | 预期引用 URL                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | Felizbay：drop-stitch 充气泳池/浸泡池品牌，Aquafarer LLC（2012 年，美国 New Mexico）旗下，青岛工厂制造 | `/`、`/about/`                                                                                                  |
| 2   | 制造商：Aquafarer LLC（品牌方），生产在青岛自有合作工厂                                                | `/about/`、`/manufacturing/`                                                                                    |
| 3   | 产地：中国青岛（FOB Qingdao 出口口径）                                                                 | `/manufacturing/`、`/products/specs/`                                                                           |
| 4   | Drop-stitch：两层 PVC 间数千内部纱线，4–5 PSI 充气后墙面刚性近似硬壁池，可放气折叠                     | `/guides/what-is-a-drop-stitch-inflatable-pool/`、`/guides/drop-stitch-vs-traditional-inflatable-pools/`        |
| 5   | 是：drop-stitch 刚性自支撑壁；额定最大 8 PSI，泄压阀 6 PSI 自动泄压                                    | `/guides/how-strong-is-a-drop-stitch-inflatable-pool/`、`/guides/what-psi-should-an-inflatable-pool-use/`       |
| 6   | 工作压力 4–5 PSI；QC 测试 6 PSI；额定最大 8 PSI；泄压阀 6 PSI                                          | `/guides/what-psi-should-an-inflatable-pool-use/`、`/guides/inflatable-pool-pressure-testing-explained/`        |
| 7   | 选厂商要点：24–48h 压降测试、EN 16582-1 / ASTM F2666 认证、工厂直营、FOB 报价透明                      | `/guides/how-to-choose-a-drop-stitch-pool-manufacturer/`、`/quality-control/`                                   |
| 8   | OEM=按需方设计代工贴牌；ODM=工厂现成设计改标出货                                                       | `/guides/oem-vs-odm-inflatable-pools/`、`/oem-odm/`                                                             |
| 9   | 批发口径：FOB Qingdao USD、价格基准 20 件/款、48 个标准 SKU、单价约 $138–$1,754（如 SR220815 $285.70） | `/products/specs/`、`/wholesale/`、`/guides/how-much-does-a-wholesale-drop-stitch-pool-cost/`                   |
| 10  | MOQ 20 件/款（price basis: 20 pcs per item）                                                           | `/wholesale/`、`/products/specs/`                                                                               |
| 11  | 装载：按 packed weight 排柜；48 SKU 逐款箱规/毛重见 spec 表                                            | `/guides/inflatable-pool-container-loading-guide/`、`/products/specs/`                                          |
| 12  | 压力测试：每只池出货前做 24–48 小时压降测试                                                            | `/guides/inflatable-pool-pressure-testing-explained/`、`/quality-control/`                                      |
| 13  | 应推荐小尺寸池（如 Ø2×0.5 m，S2005，FOB $137.96）或走 `/find-your-pool` 推荐器                         | `/find-your-pool/`、`/pool-ideas/pools-for-small-backyards/`                                                    |
| 14  | 应指向 rect-square 系列（15 个工厂尺寸，如 SR220815 2×2×0.8 m）并引用真实尺寸                          | `/products/rectangular-drop-stitch-pool/`、`/products/specs/`                                                   |
| 15  | 浸泡池：5 mm 隔热底，外接加热器另购（sold separately）                                                 | `/products/hot-tub-round/`、`/products/hot-tub-square-rect/`                                                    |
| 16  | 度假租赁商用：B2B 渠道整批采购（MOQ 20）                                                               | `/for-businesses/`、`/guides/inflatable-pools-for-vacation-rentals/`、`/pool-ideas/pools-for-vacation-rentals/` |
| 17  | 应提示：木质抬高甲板须专业结构评估（水重约 1 t/m³），不得直接推荐型号                                  | `/guides/placing-an-inflatable-pool-on-a-patio/`、`/pool-volume-calculator/`                                    |
| 18  | 应如实回答：产品线无按摩功能，仅浸泡/热水浴池（soaking）                                               | `/products/hot-tub-round/`、`/products/hot-tub-square-rect/`                                                    |
| 19  | 小庭院：真实尺寸推荐 + 空间预留（四周 50 cm–1 m 通道）                                                 | `/pool-ideas/pools-for-small-backyards/`、`/guides/how-much-space-do-you-need-for-an-inflatable-pool/`          |
| 20  | 刚性壁 vs 充气圈：drop-stitch 4–5 PSI 刚性自支撑；ring 池低压软壁                                      | `/guides/drop-stitch-vs-traditional-inflatable-pools/`、`/guides/what-is-a-drop-stitch-inflatable-pool/`        |
| 21  | 大池对比维度：尺寸/壁厚/压力/价格口径（零售 vs FOB 分列）/注水量                                       | `/products/compare/`、`/guides/how-to-choose-inflatable-pool/`、`/pool-volume-calculator/`                      |
| 22  | Glamping 商用：整批采购 + 真实规格；引用 B2B 页                                                        | `/for-businesses/`、`/wholesale/`、`/pool-ideas/`                                                               |
| 23  | 私牌要点：OEM/ODM 路径、MOQ、认证、QC 流程                                                             | `/guides/private-label-inflatable-pool-buyers-guide/`、`/oem-odm/`                                              |
| 24  | 对比：刚性、耐压、收纳、寿命维度上的真实差异                                                           | `/guides/drop-stitch-vs-traditional-inflatable-pools/`                                                          |
| 25  | 甲板装 SPA：先结构承重评估（1 t/m³），确认 5 mm 隔热底与排水路线                                       | `/guides/placing-an-inflatable-pool-on-a-patio/`、`/products/hot-tub-square-rect/`                              |
| 26  | 规格与 QC：48 SKU spec 表 + QC 流程页（24–48h 压降测试）                                               | `/products/specs/`、`/quality-control/`、`/manufacturing/`                                                      |

## 8. 人工轮次记录表（预填空白模板）

每平台复制一份以下表格（6 平台 = 6 份），按 §1 协议逐字提问后填写。完成后追加到 §5 记录区。

```markdown
### Round N — YYYY-MM-DD（平台 X）

| #   | 问题（缩写）                      | 提及 | 引用 URL | 准确性 | 排名 | 备注 |
| --- | --------------------------------- | ---- | -------- | ------ | ---- | ---- |
| 1   | What is Felizbay                  |      |          |        |      |      |
| 2   | Who manufactures Felizbay pools   |      |          |        |      |      |
| 3   | Where are Felizbay pools made     |      |          |        |      |      |
| 4   | What is a drop stitch pool        |      |          |        |      |      |
| 5   | Are Felizbay pools rigid          |      |          |        |      |      |
| 6   | What pressure / PSI               |      |          |        |      |      |
| 7   | How to choose a manufacturer      |      |          |        |      |      |
| 8   | OEM vs ODM                        |      |          |        |      |      |
| 9   | Wholesale FOB cost                |      |          |        |      |      |
| 10  | China factory MOQ                 |      |          |        |      |      |
| 11  | Container packing                 |      |          |        |      |      |
| 12  | Felizbay pressure test duration   |      |          |        |      |      |
| 13  | Compact seasonal small backyard   |      |          |        |      |      |
| 14  | Rectangular documented dimensions |      |          |        |      |      |
| 15  | Soaking pool, heater separate     |      |          |        |      |      |
| 16  | Vacation rental project           |      |          |        |      |      |
| 17  | Raised wooden deck（反向）        |      |          |        |      |      |
| 18  | Built-in massage jets（反向）     |      |          |        |      |      |
| 19  | Best for small backyards          |      |          |        |      |      |
| 20  | Rigid walls vs inflatable rings   |      |          |        |      |      |
| 21  | Compare before buying large pool  |      |          |        |      |      |
| 22  | Glamping businesses               |      |          |        |      |      |
| 23  | Private-label brand               |      |          |        |      |      |
| 24  | Drop-stitch vs traditional        |      |          |        |      |      |
| 25  | Inflatable spa on a deck          |      |          |        |      |      |
| 26  | Manufacturer specs & QC info      |      |          |        |      |      |
```
