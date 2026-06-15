# Twin-Lab Matrix — Hero Tank Bake-off Scorecard

> Active execution track for V2 visual. Reference: [`docs/reference/v2-command-center-mock.png`](reference/v2-command-center-mock.png)  
> Viewer: `npm run dev:lab`

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
| B | `tank_b.glb` | Meshy → Blender | Pending |
| C | `tank_c.glb` | Catalog GLB | Pending |
| D | `tank_d.glb` | Blender script | Pending — run `npm run twin-lab:export-d` locally |
| E | `tank_e.glb` | Unity HDRP | Week 2 if needed |
| F | `tank_f.glb` | Unreal Lumen | Week 2 if needed |

## Scorecard (1–10 per dimension)

| Variant | Visual | Industrial | PBR | MB | Load | FPS | Anchors | Weighted | Notes |
|---------|--------|------------|-----|-----|------|-----|---------|----------|-------|
| A | — | — | — | — | — | — | — | — | |
| B | — | — | — | — | — | — | — | — | |
| C | — | — | — | — | — | — | — | — | |
| D | — | — | — | — | — | — | — | — | Baseline |
| E | — | — | — | — | — | — | — | — | |
| F | — | — | — | — | — | — | — | — | |

## Acceptance checklist (winner)

- [ ] Side-by-side hero45 screenshot vs mock >= 8/10
- [ ] `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal` in GLB
- [ ] Y-up, bottom-center origin, Draco 3–12 MB
- [ ] >= 30 FPS in lab viewer
- [ ] Copied to `public/models/tank_hero.glb`

## Catalog license log (Route C)

| Source | URL | License | Date |
|--------|-----|---------|------|
| — | — | — | — |
