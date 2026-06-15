# 储罐运行诊断指挥平台

基于设计稿实现的罐区智能监控大屏（React + Vite + ECharts + React Three Fiber）。

**Current baseline:** [v1.1.0](VERSIONS.md) (`git tag v1.1.0`) — floating-roof IoT, readable UI, stable layout. See [VERSIONS.md](VERSIONS.md) for the full index and how to revert to v1.0.0.

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

## Twin-Lab（英雄罐 Bake-off）

独立对比视图，不加载指挥台面板：

```bash
npm run dev:lab
```

打开 **http://127.0.0.1:5173/twin-lab/?variant=A**，对照 mock 切换 A–F 变体。详见 [twin-lab/README.md](twin-lab/README.md)。

打开工作区时，若已启用 VS Code/Cursor 任务，会自动执行后台 dev（可在 `.vscode/tasks.json` 里关闭 `runOn: folderOpen`）。

## 构建

```bash
npm run build
npm run preview
```

## 3D 交互场景 (v1.1)

中央视区为 **真实 WebGL 3D**（非贴图）：

- 两个圆柱储罐，可 **旋转 / 缩放 / 平移**（OrbitControls）
- **悬停高亮**，**点击储罐** 打开右侧固定信息卡 + 绿色连接线
- **浮盘屋面测点**（绿/黄/红）可点击，查看时序与报警关联（储罐02 对标 TG04）
- 指针与罐体对齐（适配整页 `scale` 缩放）
- 顶栏 **字号**（标准 / 大 / 特大）便于阅读
- 代码：`src/components/scene/TankScene3D.tsx`，传感数据：`src/data/floatingRoofSensors.ts`

## 说明

当前为前端演示版本，数据来自 `src/data/mock.ts` 与 `src/data/floatingRoofSensors.ts`。对接真实 SCADA/物联网 API 时，可替换上述数据并扩展各导航模块页面。新功能请从 **`v1.1.0`** 分支开发（见 VERSIONS.md）。
