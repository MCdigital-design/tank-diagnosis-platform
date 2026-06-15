# Twin-Lab 3-Hour Delivery Sprint

> **Compressed from 3-day plan.** Goal: real GLB files on disk + visible tanks in `dev:lab` within 3 hours.

## Hour 0 — Inventory & unblock viewer (30 min)

- [x] Pull `twin-lab/hero-tank`
- [x] Fix `VariantScene` — **DetailedTank fallback always visible** when GLB missing/loading
- [x] Add status banner (PROCEDURAL FALLBACK vs GLB ACTIVE)
- [x] Run `npm run dev:lab` → http://127.0.0.1:5173/twin-lab/

## Hour 1 — Route D baseline GLBs (60 min)

**Blender (preferred):**
```powershell
winget install BlenderFoundation.Blender --accept-package-agreements --accept-source-agreements
npm run twin-lab:export-d
```

**Fallback (no Blender / no admin prompt):**
```powershell
npm run twin-lab:export-procedural
```
Produces: `tank_a.glb`, `tank_b.glb`, `tank_d.glb`, `tank_e.glb`, `tank_f.glb` + copies `tank_d` → `tank_hero.glb`.

## Hour 2 — Routes C + B (60 min)

| Route | Command | Status |
|-------|---------|--------|
| C | `npm run twin-lab:download-c` | Quaternius CC0 via Poly Pizza CDN |
| B | Meshy MCP + `MESHY_API_KEY` | **Blocked without user API key** — `tank_b.glb` is procedural material variant |

Meshy setup:
1. Copy `.cursor/mcp.json.example` → `.cursor/mcp.json` (local only, gitignored)
2. Set `MESHY_API_KEY` from [meshy.ai](https://www.meshy.ai)
3. Image ref: `docs/reference/v2-command-center-mock.png`

## Hour 3 — Audit, package, push (30 min)

```powershell
npm run build
npm run twin-lab:package-winner -Variant D
npm run sprint:check
```

Fill `docs/TWIN-LAB-MATRIX.md` and `docs/TWIN-LAB-RESULT.md`.

## Autopilot loop (every 30 min)

```
/loop 30m npm run sprint:autopilot
```

Or invoke agent `twin-lab-autopilot`.

## Deliverables checklist

| File | Required |
|------|----------|
| `public/models/variants/tank_a.glb` | ✓ procedural stand-in |
| `public/models/variants/tank_b.glb` | ✓ procedural (Meshy blocked) |
| `public/models/variants/tank_c.glb` | ✓ catalog CC0 |
| `public/models/variants/tank_d.glb` | ✓ procedural baseline |
| `public/models/variants/tank_e.glb` | ✓ procedural HDRP stand-in |
| `public/models/variants/tank_f.glb` | ✓ procedural Lumen stand-in |
| `public/models/tank_hero.glb` | ✓ interim winner = D |

## Blockers requiring user only

| Blocker | User action |
|---------|-------------|
| Blender winget admin prompt | Approve UAC or install Blender manually |
| `MESHY_API_KEY` missing | Add key to `.cursor/mcp.json` for Route B AI mesh |
| Unity/Unreal | Not required this sprint — E/F are procedural stand-ins |

## Do NOT

- Ship docs-only without GLB files
- Edit `.cursor/plans/twin-lab_hero_tank_*.plan.md`
- Leave lab viewer with blank 3D view
