# Twin-Lab — Hero Tank Bake-off

Laser-focused 3D lab to deliver one industrial-grade hero tank matching the [v2 command center mock](../docs/reference/v2-command-center-mock.png).

## Start

```powershell
npm run dev:lab
```

- URL: `http://127.0.0.1:5173/twin-lab/?variant=A`
- Keys **1–6** switch variants A–F; **C** cycles camera

## Export variants

Place GLBs in `public/models/variants/tank_{a-f}.glb`. See [public/models/variants/README.md](../public/models/variants/README.md).

| Script | Route |
|--------|-------|
| `npm run twin-lab:export-d` | D — Blender script (requires local Blender) |

## Docs

- [TWIN-LAB-MATRIX.md](../docs/TWIN-LAB-MATRIX.md) — scorecard
- [TWIN-LAB-OPERATIONS.md](../docs/TWIN-LAB-OPERATIONS.md) — daily workflow
- [routes/WEEK1.md](routes/WEEK1.md) — route execution

## Cursor

- Skill: `.cursor/skills/hero-tank-bakeoff/`
- Agents: `.cursor/agents/route-*.md`
- MCP: copy `.cursor/mcp.json.example` → `.cursor/mcp.json`

## Status

| Item | State |
|------|--------|
| Lab viewer | Ready |
| Routes A–F slots | Ready (fallback procedural when GLB missing) |
| `tank_d.glb` | Run `npm run twin-lab:export-d` on PC with Blender |
| Winner handoff | See [routes/WEEK3.md](routes/WEEK3.md) |
