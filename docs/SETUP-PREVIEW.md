# 预览上线 — 快速检查清单

连接 Cursor ↔ GitHub 后，按顺序完成下列步骤。工作流文件已包含在仓库中。

## 已完成（仓库内）

- [x] `.github/workflows/deploy-github-pages.yml` — 推送到 `master`/`main` 自动部署 GitHub Pages
- [x] `.github/workflows/deploy-gitee-pages.yml` — 手动或 `preview-*` 标签部署 Gitee
- [x] `vite.config.ts` 支持 `VITE_BASE_PATH`（子路径 / 根路径）

## 你需要完成（一次性）

### 1. GitHub 仓库与首次推送

若本地尚无 `origin`：

1. 在 GitHub 新建仓库（建议名：`tank-diagnosis-platform`，Private）
2. 本地执行：

```powershell
cd "C:\Users\elimi\Downloads\罐区智能"
git remote add origin https://github.com/<你的用户名>/tank-diagnosis-platform.git
git push -u origin master
```

3. GitHub → **Settings → Pages → Build and deployment → Source: GitHub Actions**

首次推送后 Actions 会自动构建；约 2–5 分钟可在  
`https://<用户名>.github.io/tank-diagnosis-platform/` 预览（海外 / 本人手机检查用）。

### 2. Gitee（大陆评审）

1. Gitee 新建仓库（可与 GitHub 同名），开启 **Gitee Pages**
2. 生成 Gitee **私人令牌**（仓库写入权限）
3. GitHub 仓库 → **Settings → Secrets and variables → Actions** 添加：

| Name | 示例值 |
|------|--------|
| `GITEE_TOKEN` | Gitee 私人令牌 |
| `GITEE_REPO` | `your-name/tank-diagnosis-platform` |

4. GitHub → **Actions** → **Deploy Gitee Pages** → **Run workflow**

Gitee Pages URL 在 Gitee 仓库 **服务 → Gitee Pages** 中查看。

### 3. Cursor Cloud Agent

在 [Cursor Integrations](https://cursor.com/dashboard) 确认 GitHub App 已授权**本仓库**。

---

完整 SOP 见 [`DEPLOY-SOP.md`](./DEPLOY-SOP.md)。
