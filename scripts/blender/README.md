# V2-A 英雄罐 — Blender 导出与视觉迭代

与 `src/data/heroTankSpec.ts` / `DetailedTank.tsx` 共用 **`hero_tank_spec.json`** 比例，便于 R3F 程序罐与 Blender GLB 对齐。

## 快速视觉检查（无需 Blender）

```bash
npm run dev
```

默认 `VITE_HERO_TANK_MODE=procedural`，场景使用 **DetailedTank**（外浮顶、走道、梯子、管线、测点锚点）。

对比参考图：打开 `docs/reference/v2-command-center-mock.png`，在浏览器中旋转 3D 场景迭代。

## Blender → GLB（本地）

1. 安装 [Blender](https://www.blender.org/download/) 3.6+
2. 按需编辑 `hero_tank_spec.json`（半径、高度、锚点）
3. 导出：

```bash
# Linux / macOS / Git Bash
./scripts/blender/export-hero-tank.sh

# Windows PowerShell
.\scripts\blender\export-hero-tank.ps1
```

输出：`public/models/tank_hero.glb`

4. 切换到 GLB 模式预览：

```bash
# .env.local 或命令行
VITE_HERO_TANK_MODE=glb npm run dev
```

GLB 加载失败时自动回退 **DetailedTank**。

## 模式开关

| `VITE_HERO_TANK_MODE` | 行为 |
|------------------------|------|
| `procedural`（默认） | `DetailedTank` |
| `glb` | `tank_hero.glb` → 失败则 DetailedTank |
| `simple` | v1 圆柱 `SimpleTank` |

## 迭代流程

```text
1. 对照 mock 调 hero_tank_spec.json / heroTankSpec.ts
2. npm run dev → 看 DetailedTank
3. 满意后运行 export-hero-tank → 生成 GLB
4. VITE_HERO_TANK_MODE=glb → 对比 GLB 与程序罐
5. 提交 tank_hero.glb（大文件建议 Git LFS）
```

## 说明

- 脚本为 **程序建模**，不是 AI 从单张 2D 图自动重建 mesh；比例与部件布局按 mock **工程化近似**。
- Cloud Agent 环境通常 **无 Blender**；导出请在本地 Windows 执行，再 push GLB。
- 测点空物体命名：`anchor_fire`、`anchor_ground`、`anchor_level`、`anchor_seal`。
