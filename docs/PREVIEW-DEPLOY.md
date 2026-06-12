# 内部预览部署（中国大陆）

面向 1–2 名评审同事的**静态演示**，无需 IT 专线。构建产物为 `dist/` 目录。

完整协作与发布流程见 **[`DEPLOY-SOP.md`](./DEPLOY-SOP.md)**；上线检查清单见 **[`SETUP-PREVIEW.md`](./SETUP-PREVIEW.md)**。

## 构建

**日常开发（无登录门）：**

```bash
npm install
npm run build
```

**预览包（含登录门，用于对外链接）：**

```bash
npm run build:preview
# 本地验证登录 + 仪表盘：
npm run preview:dist
```

将 `dist/` 内全部文件上传到静态托管（腾讯云 COS、轻量服务器 Nginx 等）。

## 预览登录（v1.2+）

| 环境 | 登录门 |
|------|--------|
| `npm run dev:bg` | **关闭**（本地开发不弹登录） |
| `npm run build:preview` / 预览部署 CI | **开启** — 用户名 / 密码 |

默认预览账号（可通过 GitHub Secrets `PREVIEW_USER` / `PREVIEW_PASS` 覆盖）：

- 用户名：`Z-Float`
- 密码：`008AAA`

登录成功后写入 `sessionStorage`；关闭标签页需重新登录。仪表盘横幅有 **「退出预览」**。

**安全说明：** 此为**轻度防窥**（防止链接被随意打开），凭证会出现在构建产物 JS 中，**不能**替代生产级认证。正式对外请叠加 **Nginx `auth_basic`** 或 **CDN 鉴权**（见 [`deploy/nginx/`](../deploy/nginx/)）。

环境变量见 [`.env.example`](../.env.example)。

## 推荐托管（大陆评审）

| 方式 | 说明 |
|------|------|
| **腾讯云 COS 静态网站** | **首选** — 按量计费，默认域名即可，无需 ICP |
| 腾讯云 Lighthouse + Nginx | 可叠加 `auth_basic`，见 `deploy/nginx/preview.conf` |
| 阿里云 OSS 静态托管 | 与 COS 类似 |
| Gitee Pages | 个人账号可能已下线，仅作备选 |
| 公司内网 Nginx | 有 IT 后把 `dist` 放到内网目录 |

不建议把**唯一**评审链接放在 Vercel（大陆访问不稳定）。

## 与预览相关的体验改进

- 字体已打包（`@fontsource`），不依赖 Google Fonts，国内首屏更稳
- 顶部「内部演示」横幅说明加载时间与数据性质
- 导航 / 快捷操作 / T-07 点击有演示提示；「应急广播」为说明弹窗
- 无 WebGL 时 3D 区域显示降级文案，其余面板仍可用

## 可选后续

- 自定义域名 + ICP 备案（对外长期公开时）
- 后端 `/api/login` + 内网 SSO（接入真实数据时）
