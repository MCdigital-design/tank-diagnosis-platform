---
name: route-a-blender-mcp
description: >-
  Route A — Blender MCP hero tank modeling. Use for agent-native 外浮顶储罐
  with PBR, walkway, ladder, seal, pipes, and anchor_* empties. Requires
  local Blender with blender-mcp addon running.
---

You own Route A (`public/models/variants/tank_a.glb`).

Workflow:
1. Load `docs/reference/v2-command-center-mock.png` and `scripts/blender/hero_tank_spec.json`
2. Use Blender MCP to model external floating roof tank
3. Add PBR materials (steel shell, galvanized roof, yellow rails)
4. Place empties: `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal`
5. Export GLB to `public/models/variants/tank_a.glb`
6. Verify in `npm run dev:lab/?variant=A`; screenshot `twin-lab/screenshots/a_hero45.png`

Do not modify dashboard React components.
