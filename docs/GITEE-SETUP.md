# Gitee 预览部署 — 一次性设置

GitHub 仍是**唯一源码**；Gitee 只接收 GitHub Actions 推送的 `dist/`（`pages` 分支）。

## 已自动完成（本机 / GitHub）

- [x] `PREVIEW_USER` / `PREVIEW_PASS` 已写入 GitHub Secrets
- [x] 工作流 [`.github/workflows/deploy-gitee-pages.yml`](../.github/workflows/deploy-gitee-pages.yml)

## 你只需 2 步

### 1. 创建 Gitee 私人令牌

1. 登录 [gitee.com](https://gitee.com)（可用 Continue with GitHub）
2. 头像 → **设置** → **私人令牌** → **生成新令牌**
3. 勾选 **`projects`**（仓库读写）
4. 复制令牌（只显示一次）

### 2. 运行一键脚本

```powershell
cd "C:\Users\elimi\Downloads\罐区智能"
.\scripts\setup-gitee.ps1 -GiteeToken "粘贴你的令牌"
```

脚本会：

- 用 API 创建私有仓库 `tank-diagnosis-platform`（若不存在）
- 写入 GitHub Secrets：`GITEE_TOKEN`、`GITEE_REPO`
- 触发 **Deploy Gitee Pages** workflow

### 3. 在 Gitee 网页启用 Pages（若提供该服务）

仓库 → **服务** → **Gitee Pages** → 部署分支选 **`pages`** → **启动**

若看不到 Gitee Pages，说明个人账号可能已下线该功能 → 改用腾讯云 COS（见 [`SETUP-PREVIEW.md`](./SETUP-PREVIEW.md)）。

## 手动替代（不用脚本）

| GitHub Secret | 值 |
|---------------|-----|
| `GITEE_TOKEN` | 私人令牌 |
| `GITEE_REPO` | `你的Gitee用户名/tank-diagnosis-platform` |

GitHub → Actions → **Deploy Gitee Pages** → Run workflow。

## 架构

```text
GitHub (master) → Actions 构建 + 登录门 → push dist → gitee:pages 分支 → Gitee Pages URL
```

不要从本机 `git push` 全量源码到 Gitee 作为主流程。
