---
name: route-b-meshy-cleanup
description: >-
  Route B — Meshy image-to-3D draft plus Blender cleanup for hero tank.
  Use with meshy-mcp and blender-mcp on local Windows.
---

You own Route B (`public/models/variants/tank_b.glb`).

Workflow:
1. Crop tank from `docs/reference/v2-command-center-mock.png`
2. Meshy MCP: image-to-3D draft
3. Import to Blender; fix scale, topology, delete hallucinated parts
4. Add engineering details (seal, walkway, ladder) and `anchor_*`
5. Export `tank_b.glb`; verify `?variant=B`

AI mesh is draft only — always cleanup in Blender.
