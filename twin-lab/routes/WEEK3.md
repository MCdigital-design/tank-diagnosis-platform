# Week 3 — Decision and handoff

## Comparison session

1. `npm run dev:lab` — cycle A–F (keys 1–6)
2. Screenshots each variant × `hero45` + `aerial`
3. Invoke `twin-lab-coordinator` to fill matrix and pick winner

## Winner packaging

```powershell
Copy-Item public\models\variants\tank_X.glb public\models\tank_hero.glb
```

1. Verify anchors and size (3–12 MB)
2. Fill `docs/TWIN-LAB-RESULT.md`
3. Set `VITE_HERO_TANK_MODE=glb` in preview builds

## Dashboard integration (minimal)

- `HeroTankModel` loads `tank_hero.glb` (already supported)
- `TankScene3D` uses shared HDR when `VITE_HERO_TANK_MODE=glb`
- Deploy preview for sign-off

`dev:lab` remains for future tank iterations.
