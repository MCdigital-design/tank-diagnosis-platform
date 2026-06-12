# 部署与协作 SOP — GitHub · Cloud Agent · 大陆预览

> **储罐运行诊断指挥平台** 推荐工作流：在 **GitHub** 上开发与使用 Cursor Cloud Agent；里程碑节点用 **腾讯云 COS**（首选）发布带登录门的预览包供大陆评审访问。  
> 静态构建与登录说明见 [`PREVIEW-DEPLOY.md`](./PREVIEW-DEPLOY.md)；快速清单见 [`SETUP-PREVIEW.md`](./SETUP-PREVIEW.md)。

---

## 1. 目标与原则

| 目标 | 做法 |
|------|------|
| 开发效率最高 | 本地 `npm run dev:bg` 为主；Cloud Agent 在 GitHub 上改代码 |
| 自己随时用手机看一眼 | 合并到 `main` 后自动部署 **GitHub Pages** |
| 大陆同事稳定访问 | 仅在「可展示」节点手动发布 **COS 预览**（`build:preview` + 登录门） |
| 不把托管站当开发环境 | 托管站只是 `dist/` 快照；迭代在本地 / GitHub 完成 |

**两条独立管道（勿混淆）：**

```
管道 A — 源码与 Agent：GitHub（或 GitLab）←→ Cursor Cloud Agent
管道 B — 静态预览分发：npm run build:preview → dist/ → COS / Nginx / Gitee（备选）
```

Cursor Cloud Agent **仅**通过 GitHub（或 GitLab）应用克隆与推送代码；**不能**像连 GitHub 一样直连 Gitee 仓库。Gitee 通过 **CI 脚本** 接收构建产物。

---

## 2. 架构一览

```mermaid
flowchart LR
  subgraph dev [开发与 Agent]
    Local[本地 IDE / dev:bg]
    GH[GitHub 仓库]
    CA[Cursor Cloud Agent]
    Local --> GH
    CA -->|clone / branch / PR| GH
  end

  subgraph ci [GitHub Actions]
    Build[npm ci + npm run build]
    GHP[部署 GitHub Pages]
    COSPush[上传 dist 到 COS]
    GiteePush[推送 dist 到 Gitee]
    GH -->|push main| Build
    Build --> GHP
    GH -->|手动 workflow| Build
    Build --> COSPush
    Build --> GiteePush
  end

  subgraph preview [预览受众]
    Mobile[本人手机 · GitHub Pages]
    CN[大陆评审 · COS 静态站]
    GHP --> Mobile
    COSPush --> CN
  end
```

---

## 3. 角色与职责

| 角色 | 仓库 | 用途 | 频率 |
|------|------|------|------|
| **GitHub** | 唯一源码真相源 | Cloud Agent、PR、版本标签 | 持续 |
| **本地** | 工作副本 | HMR 开发、`npm run build` 自测 | 每日 |
| **GitHub Pages** | 托管 `dist/` | 移动端 / 海外快速预览 | `main` 每次合并（自动） |
| **腾讯云 COS** | 托管 `dist/` | 大陆内部演示链接（首选） | 里程碑（手动 workflow） |
| **Gitee Pages** | 托管 `dist/` | 大陆备选（若服务可用） | 里程碑（手动触发） |

---

## 4. 一次性初始化（Checklist）

完成下列步骤后，日常只需按第 5、6 节操作。

### 4.1 GitHub 仓库

- [ ] 创建仓库（建议 **Private**），推送本项目代码
- [ ] 在 [Cursor Integrations](https://cursor.com/dashboard) 安装 **Cursor GitHub App**，授予该仓库读写权限
- [ ] 确认已订阅支持 **Cloud Agents** 的计划（见 [Cloud Agent 文档](https://cursor.com/docs/cloud-agent)）

### 4.2 腾讯云 COS 预览桶（大陆首选）

- [ ] 创建 COS 存储桶（公有读私有写 + **静态网站**）
- [ ] 记录 `COS_BUCKET`、`COS_REGION`
- [ ] 在访问管理创建 API 密钥（`COS_SECRET_ID` / `COS_SECRET_KEY`）

### 4.3 Gitee 预览仓库（备选）

- [ ] 确认个人账号仍可使用 **Gitee Pages**
- [ ] 创建预览仓库并生成 **私人令牌**

### 4.4 GitHub Actions 密钥

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：

| Secret 名称 | 说明 |
|-------------|------|
| `PREVIEW_USER` | 预览登录用户名（如 `Z-Float`） |
| `PREVIEW_PASS` | 预览登录密码 |
| `COS_SECRET_ID` | 腾讯云 API 密钥 ID |
| `COS_SECRET_KEY` | 腾讯云 API 密钥 Key |
| `COS_BUCKET` | COS 存储桶名称 |
| `COS_REGION` | 地域，如 `ap-guangzhou` |
| `GITEE_TOKEN` | （备选）Gitee 私人令牌 |
| `GITEE_REPO` | （备选）`用户名/tank-diagnosis-platform` |

### 4.5 预览登录

- 本地 `npm run dev:bg`：**不启用**登录（`VITE_PREVIEW_AUTH` 未设置）
- `npm run build:preview` 与部署 CI：**启用**登录门
- 凭证通过 Secrets 注入，勿写入公开文档仓库

### 4.6 Vite 公共路径（`base`）

若 GitHub Pages 地址为 `https://<user>.github.io/<repo>/`（**非**根域名），须在 `vite.config.ts` 设置：

```ts
base: process.env.VITE_BASE_PATH ?? '/',
```

- GitHub Actions 构建 GitHub Pages 时：`VITE_BASE_PATH=/<repo-name>/`
- Gitee 若部署在域名根路径：`VITE_BASE_PATH=/`

（具体值在添加 workflow 时与仓库名对齐；未配置 `base` 时子路径部署会出现白屏或资源 404。）

### 4.7 添加 GitHub Actions 工作流（模板）

在仓库创建 `.github/workflows/` 下两个文件（可由 Cloud Agent 代写）：

**`deploy-github-pages.yml`** — `main` 推送后自动部署：

```yaml
name: Deploy GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_BASE_PATH: /${{ github.event.repository.name }}/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

并在 GitHub 仓库 **Settings → Pages** 中选择 **GitHub Actions** 作为来源。

**`deploy-gitee-pages.yml`** — 仅里程碑发布（手动触发 + 可选 tag）：

```yaml
name: Deploy Gitee Pages
on:
  workflow_dispatch:
    inputs:
      label:
        description: '发布说明（如 v1.2.0 内部演示）'
        required: false
  push:
    tags:
      - 'preview-*'
jobs:
  build-push-gitee:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_BASE_PATH: /
      - name: Push dist to Gitee
        env:
          GITEE_TOKEN: ${{ secrets.GITEE_TOKEN }}
          GITEE_REPO: ${{ secrets.GITEE_REPO }}
        run: |
          # 示例：将 dist 推送到 Gitee 的 pages 分支（按 Gitee Pages 实际分支名调整）
          cd dist
          git init
          git config user.email "actions@github.com"
          git config user.name "GitHub Actions"
          git add -A
          git commit -m "deploy: ${{ github.sha }}"
          git push -f "https://oauth2:${GITEE_TOKEN}@gitee.com/${GITEE_REPO}.git" master:pages
```

> Gitee Pages 分支命名因账号设置而异，首次部署后于 Gitee 控制台核对并修改脚本中的目标分支。

### 4.8 Cursor Cloud Agent 密钥（可选）

若希望 Agent 在云端执行一次性部署脚本，可在 [Cloud Agents Secrets](https://cursor.com/dashboard) 配置同名令牌；**推荐仍以 GitHub Actions 为准**，避免在 Agent 对话中重复粘贴密钥。

---

## 5. 日常开发 SOP

### 5.1 本地开发（默认）

```powershell
cd <项目根目录>
npm install          # 首次
npm run dev:bg       # 启动 http://127.0.0.1:5173/
```

- 改代码 → 浏览器自动热更新
- 结束开发：`npm run dev:stop`（若 `.dev-server.pid` 指向错误进程，先删除该文件再 `dev:bg`，见下文排障）

### 5.2 使用 Cloud Agent（GitHub）

1. 在 Cursor 中选择 **Cloud**，或于 [cursor.com/agents](https://cursor.com/agents) 指定 **GitHub 仓库**
2. Agent 在独立分支开发，完成后推送并开 **PR**
3. 本地或 GitHub 上 Review → 合并到 `main`
4. 合并后 **GitHub Actions 自动更新 GitHub Pages**（若已配置 §4.5）

**Agent 适用任务：** 功能开发、修 bug、补充 workflow、更新文档。  
**Agent 不必每次发布 Gitee** — 避免评审链接随每次 commit 抖动。

### 5.3 本地验证生产构建

```powershell
npm run build
npm run preview      # 默认 http://127.0.0.1:5173/，与 dev 勿同时占用
```

---

## 6. 里程碑发布 SOP（大陆预览）

在以下时机发布 Gitee：**Tier 完成、评审会前、需/async 收集反馈**，而非每日。

### 6.1 发布前检查

- [ ] `npm run build` 本地无报错
- [ ] GitHub Pages 上功能与演示路径正常（见 `VERSIONS.md` 演示说明）
- [ ] 顶部「内部演示」横幅文案仍准确
- [ ] 版本号 / 标签与 `VERSIONS.md` 一致

### 6.2 触发 Gitee 部署

**方式 A — 手动（推荐）**

1. 打开 GitHub → **Actions** → **Deploy Gitee Pages**
2. 点击 **Run workflow**，可选填发布说明
3. 等待绿色 ✓，打开 Gitee Pages URL 验证

**方式 B — 打标签**

```bash
git tag preview-v1.2.0
git push origin preview-v1.2.0
```

推送 `preview-*` 标签后自动触发 workflow（若已按 §4.5 配置）。

### 6.3 通知评审

消息模板：

> 储罐运行诊断指挥平台 **内部演示 v1.2.0**（mock 数据）  
> 链接：<Gitee Pages URL>  
> 说明：首次加载约 10–30s（字体与 3D 资源）；建议 Chrome / Edge。

### 6.4 发布后

- 继续在 **GitHub / 本地** 开发下一迭代
- **勿**在 Gitee 上改文件；下次里程碑重新跑 workflow 即可

---

## 7. Cloud Agent 与发布的关系

| 场景 | 建议 |
|------|------|
| 日常功能开发 | Agent 只操作 GitHub PR |
| 首次搭建 CI | 让 Agent 添加 §4.5 的 workflow 与 `vite` `base` 配置 |
| 发布大陆预览 | 人工在 Actions 点 **Run workflow**，或对 Agent 说：「合并当前 PR 后，触发 Deploy Gitee Pages」 |
| Agent 能否直连 Gitee？ | **不能**替代 GitHub 集成；只能通过 Actions / 脚本 + Secrets 推送 `dist/` |

---

## 8. 版本与演示快照约定

| 类型 | 标签示例 | GitHub Pages | Gitee Pages |
|------|----------|--------------|-------------|
| 日常合并 | — | 自动更新 | 不发布 |
| 内部里程碑 | `preview-v1.2.0` | 已含于 main | 发布 |
| Git 正式版本 | `v1.2.0` | 已含于 main | 可选同步发布 |

演示路径（v1.2.0）见 `VERSIONS.md`：储罐02 浮盘行程、T4_1 火警、G4_2 接地等。

---

## 9. 排障

### ERR_CONNECTION_REFUSED（本地 :5173）

| 检查 | 处理 |
|------|------|
| 端口未监听 | `npm run dev:bg` |
| `.dev-server.pid` 陈旧 | 删除该文件后重新 `dev:bg`（勿误杀非 node 进程） |
| 日志 | 查看 `dev-server.log` |

### GitHub Pages 白屏 / 资源 404

- 核对 `VITE_BASE_PATH` 与仓库名是否一致（§4.4）
- Actions 日志中 `dist` 是否成功上传

### Gitee Pages 未更新

- 核对 `GITEE_TOKEN` 权限与 `GITEE_REPO` 路径
- 确认推送分支与 Gitee Pages 设置一致
- 在 Gitee 控制台手动「更新 Pages」

### Cloud Agent 无法启动

- Cursor Dashboard 中 GitHub 是否已连接
- 仓库是否已授权 Cursor GitHub App
- 是否为支持 Cloud Agents 的付费计划

---

## 10. 相关文档

| 文档 | 内容 |
|------|------|
| [`PREVIEW-DEPLOY.md`](./PREVIEW-DEPLOY.md) | 静态构建、`dist/` 结构、大陆托管选型 |
| [`VERSIONS.md`](../VERSIONS.md) | 版本标签、演示路径、回滚 |
| [`ROADMAP.md`](./ROADMAP.md) | 产品里程碑，决定何时发布 Gitee |
| [Cursor Cloud Agent](https://cursor.com/docs/cloud-agent) | Agent 能力、密钥、网络 |
| [Cursor GitHub 集成](https://cursor.com/docs/integrations/github) | App 安装与权限 |

---

*文档版本：2026-06-10 · 对应平台 v1.2.0*
