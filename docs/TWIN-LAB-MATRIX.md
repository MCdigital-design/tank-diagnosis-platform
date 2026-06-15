# Twin-Lab Matrix — Hero Tank Bake-off Scorecard

> Active execution track for V2 visual. Reference: [`docs/reference/v2-command-center-mock.png`](reference/v2-command-center-mock.png)  
> Viewer: `npm run dev:lab` · Sprint: [`TWIN-LAB-SPRINT-3DAY.md`](TWIN-LAB-SPRINT-3DAY.md)

## Weights

| Dimension | Weight |
|-----------|--------|
| Visual match mock (hero close-up) | 30% |
| Industrial credibility | 20% |
| Texture / PBR quality | 15% |
| File size (Draco GLB MB) | 10% |
| Load time (cold) | 10% |
| FPS @ 1080p in lab viewer | 10% |
| Anchor placement | 5% |

**Winner threshold:** weighted score highest; visual match >= 8/10; GLB 3–12 MB; anchors present.

## Routes A–F

| Route | File | Pipeline | Status |
|-------|------|----------|--------|
| A | `tank_a.glb` | Blender MCP + PBR | Pending |
| B | `tank_b.glb` | Meshy → Blender | Pending — see `scripts/twin-lab/route-b-meshy.md` |
| C | `tank_c.glb` | Catalog GLB | **Downloaded** — Quaternius CC0 water tank (interim) |
| D | `tank_d.glb` | Blender script | **Blocked** — Blender not installed; run `npm run twin-lab:export-d` locally |
| E | `tank_e.glb` | Unity HDRP | Week 2 if needed |
| F | `tank_f.glb` | Unreal Lumen | Week 2 if needed |

## Scorecard (1–10 per dimension)

| Variant | Visual | Industrial | PBR | MB | Load | FPS | Anchors | Weighted | Notes |
|---------|--------|------------|-----|-----|------|-----|---------|----------|-------|
| A | — | — | — | — | — | — | — | — | |
| B | — | — | — | — | — | — | — | — | |
| C | 3 | 4 | 2 | 10 | 9 | 9 | 1 | **4.0** | Low-poly CC0 placeholder; not floating-roof; no anchors |
| D | — | — | — | — | — | — | — | — | Baseline — blocked until Blender |
| E | — | — | — | — | — | — | — | — | |
| F | — | — | — | — | — | — | — | — | |

> Scores for C are automated sprint estimates (file size 0.03 MB, procedural fallback likely in lab until scaled). Re-score manually in `dev:lab` hero45 split view.

## Acceptance checklist (winner)

- [ ] Side-by-side hero45 screenshot vs mock >= 8/10
- [ ] `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal` in GLB
- [ ] Y-up, bottom-center origin, Draco 3–12 MB
- [ ] >= 30 FPS in lab viewer
- [ ] Copied to `public/models/tank_hero.glb`

## Catalog license log (Route C)

| Source | URL | License | Date |
|--------|-----|---------|------|
| Quaternius Water Tank | https://poly.pizza/m/XVB8vUbnZb | CC0 | 2026-06-15 |
| Avanya oil tanks (manual) | https://sketchfab.com/avanya/collections/oil-industry-48e65c85762447628b68e2672124ba76 | Per model | — |
| CGTrader factory tank (manual) | https://www.cgtrader.com/free-3d-models/industrial/other/factory-huge-oil-storage-tank | Royalty Free | — |

## Sprint automation

| Script | Purpose |
|--------|---------|
| `npm run sprint:check` | Build + doc inventory (CI-safe) |
| `npm run sprint:autopilot` | Export D, scan GLBs, print next route |
| `npm run twin-lab:package-winner` | Copy best GLB → `tank_hero.glb` |

Agent: `.cursor/agents/twin-lab-autopilot.md` — loop every 2–4h via `/loop` or Automations.
