# 储罐运行诊断指挥平台

基于设计稿实现的罐区智能监控大屏（React + Vite + ECharts + React Three Fiber）。

**Current baseline:** [v1.0.0](VERSIONS.md) (`git tag v1.0.0`) — see [VERSIONS.md](VERSIONS.md) for the version index and how to revert.

## 运行

```bash
npm install
npm run dev:bg
```

固定地址：**http://127.0.0.1:5173/**（端口被占用时会报错，不会自动换端口）

- `npm run dev:bg` — 后台启动，不占用终端（推荐在 Cursor 内置浏览器里用这个）
- `npm run dev` — 前台启动（调试用）
- `npm run dev:stop` — 停止后台服务
- `npm run preview` — 构建后预览，同样使用 5173 端口

打开工作区时，若已启用 VS Code/Cursor 任务，会自动执行后台 dev（可在 `.vscode/tasks.json` 里关闭 `runOn: folderOpen`）。

## 构建

```bash
npm run build
npm run preview
```

## 3D 交互场景 (v1)

中央视区为 **真实 WebGL 3D**（非贴图）：

- 两个圆柱储罐，可 **旋转 / 缩放 / 平移**（OrbitControls）
- **悬停高亮**，**点击储罐** 打开右侧固定信息卡 + 绿色连接线
- 指针与罐体对齐（适配整页 `scale` 缩放）
- 代码：`src/components/scene/TankScene3D.tsx`

## 说明

当前为前端演示版本，数据来自 `src/data/mock.ts`。对接真实 SCADA/物联网 API 时，可替换 mock 数据并扩展各导航模块页面。
