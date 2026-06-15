# Week 1 — Route execution guides

Run locally on Windows. Agent assists via route subagents + MCP.

## Day 1–2 (parallel)

### Route C — Catalog

1. Download candidate from links in `public/models/variants/README.md`
2. Log license in `docs/TWIN-LAB-MATRIX.md`
3. Blender: scale, anchors, export → `tank_c.glb`

### Route D — Baseline

```powershell
.\scripts\twin-lab\export-route-d.ps1
```

### Route B — Meshy

1. Invoke `route-b-meshy-cleanup` with mock PNG
2. Meshy image-to-3D → Blender cleanup → `tank_b.glb`

**Gate:** All three load in `npm run dev:lab` (fallback OK for missing files).

## Day 3–5 — Route A

1. Start Blender + blender-mcp
2. Invoke `route-a-blender-mcp`
3. Import best mesh from C or B as reference scale
4. Iterate until visual match improves; export `tank_a.glb`

## First scorecard

After D exports, fill Route D row in `docs/TWIN-LAB-MATRIX.md`.
