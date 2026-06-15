# Variant GLB slots (Twin-Lab bake-off)

Place exported hero tanks here. The lab viewer loads `tank_{a-f}.glb` via `npm run dev:lab`.

## Export contract

| Rule | Value |
|------|--------|
| Format | glTF 2.0 / GLB |
| Compression | Draco recommended |
| Up axis | Y-up |
| Origin | Tank bottom center |
| Max size | 12 MB (before Draco) |
| Anchors | `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal` |

## Routes

| File | Route | Tool |
|------|-------|------|
| `tank_a.glb` | A | Blender MCP + PBR |
| `tank_b.glb` | B | Meshy → Blender cleanup |
| `tank_c.glb` | C | Catalog asset (license logged below) |
| `tank_d.glb` | D | `scripts/blender/generate_hero_tank.py` |
| `tank_e.glb` | E | Unity HDRP export |
| `tank_f.glb` | F | Unreal Lumen export |

## Route C — catalog candidates

Log license when you download:

- [Sketchfab — Avanya Oil industry — Medium oil tank floating roof](https://sketchfab.com/avanya/collections/oil-industry-48e65c85762447628b68e2672124ba76)
- [CGTrader — Factory huge Oil Storage tank (free)](https://www.cgtrader.com/free-3d-models/industrial/other/factory-huge-oil-storage-tank)

## Route D — generate baseline

```powershell
.\scripts\blender\export-hero-tank.ps1
Copy-Item public\models\tank_hero.glb public\models\variants\tank_d.glb
```

Or set `export.output` in `scripts/blender/hero_tank_spec.json` to `../../public/models/variants/tank_d.glb`.

## Screenshots

Save to `twin-lab/screenshots/{variant}_{camera}.png` (e.g. `a_hero45.png`).

## Winner

Copy winner to `public/models/tank_hero.glb` for dashboard integration.
