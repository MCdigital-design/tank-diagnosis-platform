# 3D 模型资源

## 英雄罐（V2 bake-off 目标）

- 文件名：**`tank_hero.glb`**
- 放置路径：本目录（`public/models/tank_hero.glb`）
- 用途：`HeroTankModel` 通过 `useGLTF` 加载；**文件可不存在**，组件会自动回退到程序生成的 `SimpleTank`。
- 导出建议：glTF 2.0 / GLB、Draco 压缩、3–12 MB、Y-up、罐底中心为原点、测点挂点命名 `anchor_*`。

## 其他资产

将 Blender 导出的 `terminal_site.glb` 或单罐 `tank_01.glb` 放在此目录，在新组件中用 `useGLTF` 加载即可扩展场站上下文。

推荐导出设置：glTF 2.0 / GLB、Draco 压缩可选、单文件 < 40MB（场站上下文 15–40 MB）。
