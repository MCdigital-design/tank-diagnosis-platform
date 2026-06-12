# 预览上线 — 快速检查清单

仓库：`MCdigital-design/tank-diagnosis-platform`（GitHub）

## 已完成（仓库内）

- [x] 预览登录门（`Z-Float` / `008AAA`，仅 `build:preview` 与部署 CI 启用）
- [x] `npm run build:preview` / `npm run preview:dist`
- [x] `.github/workflows/deploy-cos-preview.yml` — 腾讯云 COS（手动触发）
- [x] `.github/workflows/deploy-gitee-pages.yml` — Gitee 备选
- [x] `deploy/nginx/` — Lighthouse 可选配置

## 本地验证

```powershell
cd "C:\Users\elimi\Downloads\罐区智能"

# 日常开发：无登录（npm run dev:bg / start 同上）
npm run dev:bg

# 本地看登录页（热更新，同样 :5173）→ Z-Float / 008AAA
npm run dev:preview

# 模拟线上预览包（先 build 再 preview）
npm run preview:dist
```

**说明：** `dev:bg` 故意不启用登录，方便改代码。要看登录门请用 `dev:preview` 或 `preview:dist`。

## GitHub Secrets（预览部署）

**已设置：** `PREVIEW_USER`、`PREVIEW_PASS`

**Gitee 一键配置：** 见 [`GITEE-SETUP.md`](./GITEE-SETUP.md) → 运行 `scripts/setup-gitee.ps1 -GiteeToken "..."`

| Name | 值 |
|------|-----|
| `PREVIEW_USER` | `Z-Float`（已设置） |
| `PREVIEW_PASS` | `008AAA`（已设置） |

**腾讯云 COS（大陆链接，账号就绪后添加）：**

| Name | 说明 |
|------|------|
| `COS_SECRET_ID` | 腾讯云 API 密钥 ID |
| `COS_SECRET_KEY` | 腾讯云 API 密钥 Key |
| `COS_BUCKET` | 存储桶名称，如 `tank-preview-1250000000` |
| `COS_REGION` | 地域，如 `ap-guangzhou` |

**Gitee 备选（若 Pages 仍可用）：** `GITEE_TOKEN`、`GITEE_REPO`

## 发布大陆预览（COS）

1. 腾讯云控制台 → COS → 创建存储桶（**公有读** + **静态网站**索引 `index.html`）
2. 填入上述 COS Secrets
3. GitHub → **Actions** → **Deploy COS Preview** → **Run workflow**
4. 分享 COS 静态网站 URL + 预览账号（飞书私聊，勿写入公开 README）

## 发布备选（Gitee）

```powershell
.\scripts\setup-gitee.ps1 -GiteeToken "你的令牌"
```

然后在 Gitee 仓库启用 **Gitee Pages**（分支 `pages`）。详见 [`GITEE-SETUP.md`](./GITEE-SETUP.md)。

## GitHub Pages 说明

私有仓库当前计划**不支持** GitHub Pages。海外自检可用 `npm run preview:dist`，或改公开仓库后再启用 Pages。

## Cursor Cloud Agent

在 [Cursor Integrations](https://cursor.com/dashboard) 确认 GitHub App 已授权本仓库。

---

完整 SOP 见 [`DEPLOY-SOP.md`](./DEPLOY-SOP.md)。
