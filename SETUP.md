# SETUP.md — 首次部署 / 环境搭建完整指南

> 从零把本仓库部署到线上（Cloudflare Pages + 5 Workers + D1 + R2 + Vectorize）的**一次性**设置步骤。
> 日常部署只需 push 到 `main`（见 §7），无需重复本指南。
> 架构背景见 `README.md` §0–6 与 `TECH.md` §7/§10。

## 当前状态（2026-10-16 检查结果）

| 项目                                | 状态                  | 说明                                                                                        |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| `felizbay.com` / `www.felizbay.com` | ⚠️ Squarespace 停车页 | 域名 NS 未指向 Cloudflare，显示 "Coming Soon"                                               |
| `felizbay.pages.dev`                | ❌ 不存在             | Pages 项目未创建                                                                            |
| GitHub Secrets                      | ❌ 0 个已配置         | CI 只构建不部署（deploy.yml guard 跳过全部 Cloudflare 步骤）                                |
| 本地 wrangler                       | ❌ 未登录             | 无 `~/.wrangler` 配置                                                                       |
| admin-worker CMS 目标仓库           | ⚠️ 需确认             | `wrangler.toml` vars 指向 `Felizbay/official`，而代码仓库是 `aquafarer/felizbay`（见 §3.4） |

---

## 0. 前提条件

- Node.js **>= 22.12.0**、npm、Git
- 一个 [Cloudflare 账户](https://dash.cloudflare.com/sign-up)（Free plan 即可）
- 域名 `felizbay.com` 的注册商控制权（当前在 Squarespace）
- GitHub 仓库（本仓库）的 **Admin** 权限（设置 Secrets 需要）
- 第三方账号：Google Cloud Console、[Resend](https://resend.com)、（可选）IndexNow

## 1. Cloudflare 资源初始化（一次性）

所有资源**必须先手动创建**——CI 只向已存在的资源内部署（Pages 项目、R2 桶、D1 库都不存在时 CI 会失败）。

### 1.1 登录 wrangler

```bash
npx wrangler login          # 浏览器授权；或用 CLOUDFLARE_API_TOKEN 环境变量
```

### 1.2 创建 D1 数据库

```bash
npx wrangler d1 create Felizbay-db
# 输出中的 database_id 记录下来 → 即 GitHub Secret CF_PROD_D1_ID
# 迁移（建表）由 CI 首次部署自动执行（migrations/0000 + 0002），也可手动：
npx wrangler d1 migrations apply Felizbay-db --remote
```

### 1.3 创建 R2 桶（2 个）

```bash
npx wrangler r2 bucket create felizbay-assets   # 静态资产（图片/PDF），经 assets.felizbay.com 提供
npx wrangler r2 bucket create felizbay-data     # Worker 运行时数据（附件/SEO/缓存/计数器）
npx wrangler r2 bucket cors set felizbay-assets --file scripts/r2-cors.json   # = npm run deploy:r2cors
```

### 1.4 创建 Pages 项目

```bash
npx wrangler pages project create felizbay --production-branch main
```

### 1.5 创建 Vectorize 索引

```bash
npx wrangler vectorize create ai-index-v2 --dimensions=1024 --metric=cosine
```

（CI 的 "Ensure Vectorize index exists" 步骤也会幂等创建，此步可跳过，但建议提前做以尽早发现权限问题。）

## 2. 域名接入 Cloudflare（当前关键阻塞项）

`felizbay.com` 目前解析到 Squarespace 停车页，必须完成 NS 迁移站点才能上线。

1. **Cloudflare 添加站点**：Dashboard → Add a domain → `felizbay.com` → Free plan → Cloudflare 分配两个 nameserver（形如 `xxx.ns.cloudflare.com`）
2. **关闭 DNSSEC**（若 Squarespace 开了）：Squarespace 域名设置 → 先移除 DS 记录，否则切换 NS 后解析失败
3. **Squarespace 切 NS**：域名设置 → Nameservers → Use custom nameservers → 填入 Cloudflare 的两个 NS → 等待 zone Active（几分钟到 48 小时）
4. **Pages 绑定主域**：Dashboard → Workers & Pages → `felizbay` 项目 → Custom domains → 依次添加 `felizbay.com` 和 `www.felizbay.com`（zone 在同一账户时 Cloudflare 自动建 CNAME → `felizbay.pages.dev`）
5. **R2 绑定资产子域**：Dashboard → R2 → `felizbay-assets` → Settings → Public access → Connect Domain → `assets.felizbay.com`
6. **邮件 DNS（Resend 验证时用）**：见 §3.2，验证记录添加到 Cloudflare zone 的 DNS 里

> Workers 的 zone 路由（`routes = [{ pattern = "felizbay.com/api/...", zone_name = "felizbay.com" }]`）在 zone 接入 Cloudflare 后自动生效，无需额外配置。

## 3. 第三方服务密钥

### 3.1 Cloudflare Turnstile（验证码）

Dashboard → Turnstile → Add site → 域名填 `felizbay.com` → 得到：

- `TURNSTILE_SITE_KEY`（公开，构建时注入联系表单/登录页）
- `TURNSTILE_SECRET_KEY`（服务端校验，contact + admin worker）

### 3.2 Resend（联系表单邮件）

1. [Resend Dashboard](https://resend.com/domains) → Add Domain → `felizbay.com`
2. 按提示把 **SPF（TXT）+ DKIM（CNAME）** 记录添加到 Cloudflare zone DNS，等待 Verified
3. Create API Key → `RESEND_API_KEY`
4. 发件地址：`web@mail.felizbay.com` → 收件：`info@felizbay.com`（对应 §4 的 `CONTACT_FROM_EMAIL` / `CONTACT_EMAIL_TO`）

### 3.3 Google OAuth（管理后台登录）

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → 创建 OAuth client ID（Web application）
2. Authorized redirect URI：`https://felizbay.com/api/auth/callback/google`
3. Authorized JavaScript origins：`https://felizbay.com`
4. 得到 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

> better-auth 的 `baseURL` 来自 admin-worker 的 `BETTER_AUTH_URL` var（当前已设为 `https://felizbay.com`）。

### 3.4 CMS 内容仓库与 GitHub PAT（⚠️ 部署前必须确认）

admin-worker 的 `workers/admin-worker/wrangler.toml` 当前配置：

```toml
[vars]
GITHUB_OWNER = "Felizbay"      # ← 不是本代码仓库的 owner（aquafarer）
GITHUB_REPO = "official"       # ← CMS 内容写入目标
```

二选一：

- **A. 内容与代码同仓**：把 vars 改为 `GITHUB_OWNER = "aquafarer"`、`GITHUB_REPO = "felizbay"` 并提交
- **B. 独立内容仓**：创建 `Felizbay/official` 仓库（Keystatic 管理后台的读写目标）

然后创建一个 **Fine-grained PAT**（对内容仓库 `Contents: Read and write`），用于 §6 的 `GITHUB_TOKEN` worker secret。

### 3.5 生成随机密钥

```bash
openssl rand -base64 32   # BETTER_AUTH_SECRET
openssl rand -hex 32      # SESSION_SECRET（legacy 回退，可选）
openssl rand -hex 24      # REINDEX_TOKEN（ai-worker /api/reindex 令牌）
```

## 4. 创建 Cloudflare API Token（供 CI 使用）

Dashboard → My Profile → API Tokens → Create Token → **Create Custom Token**：

| 权限类别 | 项目               | 级别  |
| -------- | ------------------ | ----- |
| Account  | Cloudflare Pages   | Edit  |
| Account  | Workers Scripts    | Edit  |
| Account  | D1                 | Edit  |
| Account  | Workers R2 Storage | Edit  |
| Account  | Vectorize          | Edit  |
| Account  | Workers AI         | Edit  |
| Account  | Account Settings   | Read  |
| Zone     | Zone               | Read  |
| Zone     | DNS                | Edit  |
| Zone     | Cache Purge        | Purge |

Zone Resources 选 Include → `felizbay.com`。创建后得到 `CLOUDFLARE_API_TOKEN`。
（若 wrangler 运行时额外报权限错误，按报错信息增补对应项。）

## 5. 设置 GitHub Secrets（14 个）

**位置：GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret**

> **关于 Variables（同页的 "New repository variable" 标签）：无需设置。**
> 四个工作流（`ci.yml` / `deploy.yml` / `ai-index.yml` / `seo-gate.yml`）已逐一检查，不含任何 `vars.*` 引用——所有配置均通过 `secrets.*` 传入。Secrets 与 Variables 的区别：Secret 加密存储且日志中自动脱敏（适合密钥）；Variables 明文存储（适合非敏感开关）。本项目未使用后者，此页只添加 Secrets。环境级（Environments）Secrets/Variables 同样未使用（仓库无 environment 配置）。

| Secret                  | 值                                   | 来源                           |
| ----------------------- | ------------------------------------ | ------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | §4 创建的 token                      | Cloudflare                     |
| `CLOUDFLARE_ACCOUNT_ID` | 账户 ID                              | Dashboard 首页右侧栏           |
| `CLOUDFLARE_ZONE_ID`    | `felizbay.com` 的 Zone ID            | Dashboard → 域名概览右下       |
| `CF_PROD_D1_ID`         | D1 database_id                       | §1.2 输出 / `wrangler d1 list` |
| `TURNSTILE_SITE_KEY`    | 公开 key                             | §3.1                           |
| `TURNSTILE_SECRET_KEY`  | 服务端 key                           | §3.1                           |
| `RESEND_API_KEY`        | 邮件 API key                         | §3.2                           |
| `CONTACT_EMAIL_TO`      | 通知收件箱，如 `info@felizbay.com`   | 自定                           |
| `CONTACT_FROM_EMAIL`    | 发件地址，如 `web@mail.felizbay.com` | 自定（须在 Resend 已验证域内） |
| `BETTER_AUTH_SECRET`    | 会话签名密钥                         | §3.5                           |
| `ADMIN_EMAILS`          | 管理员邮箱，逗号分隔                 | 自定                           |
| `GOOGLE_CLIENT_ID`      | OAuth client ID                      | §3.3                           |
| `GOOGLE_CLIENT_SECRET`  | OAuth client secret                  | §3.3                           |
| `REINDEX_TOKEN`         | `/api/reindex` Bearer 令牌           | §3.5                           |

设置完成后的下一次 push，deploy.yml 的 guard 会放行全部部署步骤。

## 6. 手动 Worker Secrets（CI 不同步的部分）

deploy.yml 只 `secret bulk` 同步 contact/admin/ai 三组；以下需在首次 CI 部署**之后**手动设置一次（worker 必须先存在）：

```bash
# CMS 内容写入 PAT（对 §3.4 确认的内容仓库有 Contents 写权限）
npx wrangler secret put GITHUB_TOKEN --name felizbay-admin

# 可选：legacy 会话回退（缺省时回落到 BETTER_AUTH_SECRET）
npx wrangler secret put SESSION_SECRET --name felizbay-admin

# 可选：联系表单发件人显示名
npx wrangler secret put CONTACT_FROM_NAME --name felizbay-contact
```

automation-worker 的 `[vars]`（`workers/automation-worker/wrangler.toml`）中 `INDEXNOW_KEY` 与 `CLEANUP_TOKEN` 当前为空——用到 IndexNow/手动清理触发时填入后重新部署该 worker（`npm run deploy:worker-automation`），不用可留空。

## 7. 首次部署

### 方式 A：推送到 main（推荐）

```bash
git push origin main     # 触发 deploy.yml 全流程
```

CI 自动执行：`npm ci` → `npm run check` → `build` → R2 上传 → Pages 部署 → 注入 D1 ID → D1 迁移 + news 种子 → worker secrets 同步 → Vectorize 确保 → 5 Workers 部署 → CDN 缓存清理。随后 `ai-index.yml` 自动调用 `/api/reindex` 重建向量索引。

### 方式 B：本地部署

```bash
npx wrangler login       # 或 export CLOUDFLARE_API_TOKEN=...  CLOUDFLARE_ACCOUNT_ID=...
# 先把 5 个 workers/*/wrangler.toml 里的 REPLACE_WITH_D1_DATABASE_ID
# 替换为 §1.2 的真实 database_id（CI 是用 sed 自动注入的，本地需手动）
npm run deploy:all       # build + Pages + 5 Workers
npm run deploy:r2        # R2 资产上传
node scripts/seed-news.mjs   # news 表为空时种子
```

## 8. 部署后验证清单

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://felizbay.pages.dev/                  # 200（默认域，立即可用）
curl -s -o /dev/null -w "%{http_code}\n" https://felizbay.com/                        # 200 且不再是 Squarespace 停车页
curl -s -o /dev/null -w "%{http_code}\n" https://felizbay.com/news/                   # 200（news-worker）
curl -s -o /dev/null -w "%{http_code}\n" https://felizbay.com/rss.xml                 # 200
curl -s -X POST https://felizbay.com/api/contact -H "Content-Type: application/json" -d '{}'   # 非 526/500 即路由已通
```

- [ ] 首页/产品页/搜索正常，联系表单显示 Turnstile 组件
- [ ] 提交联系表单 → `info@felizbay.com` 收到 Resend 邮件
- [ ] `/login` 能用 Google OAuth 登录，`ADMIN_EMAILS` 内邮箱获得 admin 角色
- [ ] `/keystatic/` 后台可列出并保存内容（GITHUB_TOKEN 有效）
- [ ] `npx wrangler deployments list --name felizbay-contact`（5 个 worker 均有部署记录）
- [ ] `npx wrangler d1 execute Felizbay-db --remote --command "SELECT count(*) FROM news;"` → 有种子数据
- [ ] sitemap（`/sitemap.xml`）、`/llms.txt`、robots.txt 可访问

## 9. 常见问题

- **CI 绿但站点没更新** → GitHub Secrets 未设置，deploy.yml guard 跳过了部署（看 run 日志里的 `Check for Cloudflare credentials` 步骤输出）
- **`wrangler pages deploy` 报 Project not found** → §1.4 未执行
- **Pages 部署失败：单文件 ≥ 25 MiB** → 见 TECH.md §11.11（大 JSON 禁止进 `public/`）
- **DNS 切换后打不开** → 检查 Squarespace DNSSEC/DS 记录是否已移除（§2.2）
- **Resend 发信失败** → 域名未 Verified（§3.2 的 DNS 记录缺失）
- **Google 登录 redirect_uri_mismatch** → 回调地址必须精确为 `https://felizbay.com/api/auth/callback/google`
- **推送被墙** → 见 TECH.md §11.19（TLS 重置/DNS 劣化排查）
