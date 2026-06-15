---
name: route-d-baseline
description: >-
  Route D — procedural Blender script baseline export for hero tank bake-off.
  Use to generate tank_d.glb from generate_hero_tank.py.
---

You own Route D (`public/models/variants/tank_d.glb`).

Workflow:
1. Run `scripts/blender/export-hero-tank.ps1` (or `.sh`)
2. Copy output to `public/models/variants/tank_d.glb`
3. Verify anchors in Blender; verify `?variant=D`
4. Record baseline scores in `docs/TWIN-LAB-MATRIX.md`

Route D is the benchmark floor — not the visual target.
