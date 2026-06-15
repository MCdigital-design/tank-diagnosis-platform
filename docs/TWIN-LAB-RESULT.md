# Twin-Lab Result

> Filled when bake-off winner is declared (Week 3).

## Winner

| Field | Value |
|-------|-------|
| Route | _Interim — Route C placeholder_ |
| File | `public/models/tank_hero.glb` |
| Source variant | `tank_c.glb` (Quaternius CC0) |
| Declared | 2026-06-15 (sprint Day 1 — pending manual re-score) |

## Autopilot log

### 2026-06-15 — Sprint Day 1

- **GLBs present:** `tank_c.glb` (0.03 MB, Quaternius CC0 via Poly Pizza CDN)
- **Blocked:** Route D — Blender not found on workstation
- **Best variant:** C (only available; visual ~3/10 vs mock — interim only)
- **Next action:** Install Blender → `npm run twin-lab:export-d`; or manual Sketchfab floating-roof → replace `tank_c.glb`
- **Commands:** `npm run sprint:autopilot` · `npm run dev:lab?variant=C`

## Final scores

| Variant | Weighted | Visual /10 | Notes |
|---------|----------|------------|-------|
| A | — | — | |
| B | — | — | |
| C | 4.0 | 3/10 | CC0 placeholder; replace when D/B ready |
| D | — | — | Baseline |
| E | — | — | |
| F | — | — | |

## Pipeline SOP (repeat for next tanks)

1. _Document winning route steps here after selection_

## Handoff checklist

- [ ] `tank_hero.glb` in repo (LFS if > 10 MB)
- [ ] `VITE_HERO_TANK_MODE=glb` for production preview
- [ ] Lab HDR/lighting ported to dashboard `TankScene3D`
- [ ] Preview deploy verified
- [ ] `docs/TWIN-LAB-MATRIX.md` archived with final scores
