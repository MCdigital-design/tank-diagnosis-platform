# 内部预览部署（中国大陆）

面向 1–2 名评审同事的**静态演示**，无需 IT 专线。构建产物为 `dist/` 目录。

完整协作与双通道发布流程（GitHub · Cloud Agent · Gitee Pages）见 **[`DEPLOY-SOP.md`](./DEPLOY-SOP.md)**。

## 构建

```bash
npm install
npm run build
```

将 `dist/` 内全部文件上传到静态托管（对象存储 + CDN 或 Pages）。

## 推荐托管

| 方式 | 说明 |
|------|------|
| Gitee Pages | 免费静态页，国内访问较稳定 |
| 腾讯云 COS + CDN / 阿里云 OSS | 按量计费，适合正式内网外链 |
| 公司内网 Nginx | 有 IT 后把 `dist` 放到内网目录即可 |

不建议把**唯一**评审链接放在 Vercel（大陆访问不稳定）。可备用，不作为主链接。

## 与 v1.1.1 相关的预览改进

- 字体已打包（`@fontsource`），不依赖 Google Fonts，国内首屏更稳
- 顶部「内部演示」横幅说明加载时间与数据性质
- 导航 / 快捷操作 / T-07 点击有演示提示；「应急广播」为说明弹窗
- 无 WebGL 时 3D 区域显示降级文案，其余面板仍可用

## 可选后续

- 基础认证（Nginx `auth_basic` 或 CDN 鉴权）
- 自定义域名 + ICP 备案（对外长期公开时）
