# PRD — V2 视觉基线：指挥台 3D 场景

> 版本 v0.1 · 2026-06-14 · 状态：**草案**  
> 视觉参考：[`docs/reference/v2-command-center-mock.png`](reference/v2-command-center-mock.png)  
> 上游：v1.2 演示平台 · `docs/ROADMAP.md`

---

## 1. 愿景

将 3D 主场景从程序几何体（`SimpleTank` 圆柱）升级为与 **v2 指挥台 mock** 一致的工业储罐资产：深色场站氛围、可读性强的罐体细节、测点锚点与侧栏信息卡联动。目标不是重写应用，而是在现有 React + R3F 栈上 **渐进替换视觉层**。

## 2. 策略

| 原则 | 说明 |
|------|------|
| 继承 v1.2 | 保留 `TankSelectionContext`、浮盘标尺、测点引线、面板布局 |
| GLB 替换 SimpleTank | 英雄罐用烘焙 GLB；缺失或加载失败时回退程序几何 |
| 同栈运行 | 继续 `@react-three/fiber` + `@react-three/drei`，不引入新 3D 框架 |

## 3. Hero Tank Bake-off

同一导出规范下对比 **Blender**（主路径）与可选 **3ds Max / Unity** 管线：

| 维度 | 权重说明 |
|------|----------|
| 视觉匹配 mock | 与参考图轮廓、材质、比例一致度 |
| 文件大小 (MB) | Draco 压缩后 GLB |
| 首帧时间 | 冷启动到可交互 |
| 运行时 FPS | 双罐 + 测点场景 ≥ 30 fps |
| 测点锚点 | 命名节点 / Empty 可挂 `RoofSensorMarkers` |
| 艺术家工时 | 建模 + UV + 导出 + 迭代 |

**统一导出规范：** glTF 2.0 / GLB、Draco 可选、Y-up、原点在罐底中心、节点命名 `anchor_*`。

## 4. 资产预算

| 资产 | 预算 |
|------|------|
| 英雄罐 GLB | 3–12 MB（Draco） |
| 场站上下文 GLB | 15–40 MB |
| 纹理 | 1K–2K，PBR |
| 英雄罐三角面 | 50k–200k |

## 5. 阶段划分

| 阶段 | 交付 |
|------|------|
| **V2-A** | 英雄罐 GLB 接入 + SimpleTank 回退（`HeroTankModel`） |
| **V2-A.0** | ✅ `DetailedTank` 程序英雄罐 + Blender 导出脚本（`scripts/blender/`） |
| **V2-B** | 场站地面 / 管廊 / 照明上下文 |
| **V2-C** | 测点锚点与 3D 标记对齐 |
| **V2-D** | 面板与 mock 信息密度、动效 parity |

## 6. 运行时

- **栈：** React 18 + R3F + drei（`useGLTF`、`Suspense`）
- **加载：** Draco decoder（按需）；大资产走 LFS / COS，构建时 `VITE_BASE_PATH` 兼容子路径部署
- **回退：** `tank_hero.glb` 缺失 → `SimpleTank`；`VITE_USE_HERO_GLB=false` 强制程序罐
- **占位：** Suspense 期间低透明度圆柱占位

## 7. 集成里程碑

1. ✅ `HeroTankModel` spike + `TankScene3D` 接线  
2. ✅ `DetailedTank` 程序英雄罐 + `scripts/blender/generate_hero_tank.py`  
3. ☐ Bake-off 选定管线，提交 `public/models/tank_hero.glb`  
4. ☐ 场站 GLB 与相机默认位姿对齐 mock  
5. ☐ 锚点驱动 `RoofSensorMarkers` 坐标  
6. ☐ 性能验收（首帧、FPS、移动端 WebGL 降级）
