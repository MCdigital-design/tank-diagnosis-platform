# Twin-Lab Operations

## Quick start

```powershell
npm run dev:lab
```

Opens `http://127.0.0.1:5173/twin-lab/?variant=A` with split mock + 3D view.

## Daily workflow (local-first)

1. **Morning:** Pick route agent (`.cursor/agents/route-*.md`)
2. **Model:** Blender / Meshy / Unity / Unreal on Windows PC
3. **Export:** Drop GLB in `public/models/variants/tank_{x}.glb`
4. **Compare:** `?variant=X` next to reference mock
5. **Score:** Update `docs/TWIN-LAB-MATRIX.md`
6. **Screenshot:** `twin-lab/screenshots/{x}_{camera}.png`

## Keyboard shortcuts (lab viewer)

| Key | Action |
|-----|--------|
| 1–6 | Switch variant A–F |
| C | Cycle camera (hero45 / aerial) |

## MCP setup (Windows)

1. Copy `.cursor/mcp.json.example` → `.cursor/mcp.json`
2. Install Blender 4.x + [blender-mcp](https://github.com/ahujasid/blender-mcp) addon
3. Add Meshy API key
4. Cursor Settings → MCP → enable blender + meshy

## Multitask usage

- Max **2 parallel workers**: e.g. (1) lab viewer fix (2) catalog research
- DCC work stays **local** — Cloud Agent cannot run Blender/Unity/Unreal

## Loop (long sessions)

```
/loop 45m Compare dev:lab ?variant=A to mock; list top 3 visual gaps and spec tweaks
```

## Week schedule

| Week | Focus |
|------|--------|
| 1 | Routes C, B, D (days 1–2) then A (days 3–5) |
| 2 | E, F if best < 8/10; polish HDR/site stub |
| 3 | Comparison session, winner, `tank_hero.glb` handoff |

## Screenshot protocol

- Cameras: `hero45`, `aerial`
- Filename: `{variant}_{camera}.png` (lowercase variant letter)
- Capture with mock in split view for scorecard evidence

## Branch

Work on `twin-lab/hero-tank`. Do not merge dashboard changes until Phase 3.
