---
name: hero-tank-bakeoff
description: >-
  Twin-Lab hero tank bake-off for industrial 外浮顶储罐 GLB variants A–F.
  Use when working on twin-lab, variant GLB exports, route agents, scorecard,
  or comparing models to docs/reference/v2-command-center-mock.png.
disable-model-invocation: true
---

# Hero Tank Bake-off

## Scope

- **In scope:** `twin-lab/`, `public/models/variants/`, `src/twin-lab/`, route agents, GLB exports
- **Frozen:** `src/App.tsx`, `src/components/DashboardPanels.tsx` until winner handoff

## Reference

- Mock: `docs/reference/v2-command-center-mock.png`
- Spec: `src/data/heroTankSpec.ts`, `scripts/blender/hero_tank_spec.json`
- Viewer: `npm run dev:lab` → `/twin-lab/?variant=A`

## Routes

| ID | Output | Pipeline |
|----|--------|----------|
| A | `tank_a.glb` | Blender MCP + PBR |
| B | `tank_b.glb` | Meshy image-to-3D → Blender |
| C | `tank_c.glb` | Catalog GLB |
| D | `tank_d.glb` | Blender script baseline |
| E | `tank_e.glb` | Unity HDRP → GLB |
| F | `tank_f.glb` | Unreal Lumen → GLB or stills |

## Export rules

- glTF 2.0 GLB, Y-up, origin tank bottom center
- Anchors: `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal`
- Target 3–12 MB Draco; judge in lab viewer with **identical** HDR/post

## Scorecard

Update `docs/TWIN-LAB-MATRIX.md` after each variant export.

## Loop (local)

`/loop 45m Compare dev:lab variant X to mock; list top 3 visual gaps`
