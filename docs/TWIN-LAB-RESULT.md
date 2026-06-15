# Twin-Lab Result

> Interim winner declared during 3-hour delivery sprint (2026-06-15).

## Winner (interim)

| Field | Value |
|-------|-------|
| Route | **D — Baseline procedural** |
| File | `public/models/tank_hero.glb` |
| Source variant | `tank_d.glb` (Node GLTFExporter from `hero_tank_spec.json`) |
| Declared | 2026-06-15 |
| Weighted score | 7.0 / 10 |

## Why D wins (for now)

- Matches `heroTankSpec` proportions (floating roof, walkway, ladder, pipes, vent)
- Includes sensor anchors (`anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal`)
- Visible in `dev:lab` without Blender/Unity/Unreal/Meshy
- Route C catalog tank is CC0 but wrong silhouette (water tank, not 外浮顶)

## Autopilot log

### 2026-06-15 — 3-hour sprint

- **GLBs present:** `tank_a`–`tank_f` + `tank_hero` (all routes filled)
- **Export method:** `npm run twin-lab:export-procedural` (Three.js GLTFExporter + FileReader polyfill)
- **Viewer fix:** `VariantScene` always shows DetailedTank when GLB missing/loading; status banner added
- **Blender:** winget downloaded Blender 5.1.2 — install blocked on UAC prompt
- **Meshy:** No `MESHY_API_KEY` in env — `tank_b.glb` is procedural material variant
- **Best variant:** D (weighted 7.0)
- **Next action:** User approves Blender UAC → `npm run twin-lab:export-d` for higher-fidelity D; add Meshy key for Route B

## Final scores

| Variant | Weighted | Visual /10 | Notes |
|---------|----------|------------|-------|
| A | 6.8 | 6/10 | Procedural enhanced panels |
| B | 6.2 | 5/10 | Procedural; Meshy blocked |
| C | 4.0 | 3/10 | CC0 catalog placeholder |
| D | **7.0** | **6/10** | **Interim winner** |
| E | 6.3 | 5/10 | HDRP procedural stand-in |
| F | 6.3 | 5/10 | Lumen procedural stand-in |

## Pipeline SOP (repeat for next tanks)

1. Run `npm run twin-lab:export-procedural` for instant GLB slots
2. Upgrade Route D with Blender: `npm run twin-lab:export-d`
3. Compare in `npm run dev:lab` hero45 split view
4. `npm run twin-lab:package-winner -Variant D` when scores beat interim

## Handoff checklist

- [x] `tank_hero.glb` in repo
- [ ] `VITE_HERO_TANK_MODE=glb` for production preview
- [ ] Lab HDR/lighting ported to dashboard `TankScene3D`
- [ ] Preview deploy verified
- [x] `docs/TWIN-LAB-MATRIX.md` updated with scores
