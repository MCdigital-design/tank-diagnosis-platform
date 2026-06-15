# Route B — Meshy image-to-3D + Blender cleanup

> Requires **local Windows** with Meshy API key and Blender. Cloud agents cannot run this route.

## Prerequisites

1. Copy `.cursor/mcp.json.example` → `.cursor/mcp.json`
2. Set `MESHY_API_KEY` in `.cursor/mcp.json` or `.env` (get key at [meshy.ai](https://www.meshy.ai))
3. Install Blender 3.6+ and optionally enable `blender-mcp` in MCP config
4. Reference mock: `docs/reference/v2-command-center-mock.png`

## MCP setup (Cursor)

```json
{
  "mcpServers": {
    "meshy": {
      "command": "npx",
      "args": ["-y", "@meshy-ai/meshy-mcp-server"],
      "env": { "MESHY_API_KEY": "msy_YOUR_KEY_HERE" }
    },
    "blender": {
      "command": "cmd",
      "args": ["/c", "uvx", "blender-mcp"]
    }
  }
}
```

Restart Cursor after saving `.cursor/mcp.json`.

## Agent prompt (invoke `route-b-meshy-cleanup`)

```
Route B hero tank for Twin-Lab bake-off.

1. Crop the tank from docs/reference/v2-command-center-mock.png (hero close-up, no UI chrome).
2. Meshy MCP: image-to-3D, mode mesh, target industrial cylindrical floating-roof storage tank.
3. Download draft GLB/FBX from Meshy.
4. Blender MCP: import, scale to radius 2.35m height 5.4m (see scripts/blender/hero_tank_spec.json).
5. Add anchor empties: anchor_fire, anchor_ground, anchor_level, anchor_seal at spec positions.
6. Clean topology, add walkway/ladder/seal ring if missing.
7. Export Draco GLB → public/models/variants/tank_b.glb
8. Verify npm run dev:lab ?variant=B vs mock hero45 camera.
9. Update docs/TWIN-LAB-MATRIX.md row B with scores.
```

## Manual fallback (no MCP)

1. Upload mock crop to [Meshy.ai](https://www.meshy.ai) web UI → Image to 3D
2. Download GLB
3. Open in Blender; follow steps 4–7 above
4. Save as `public/models/variants/tank_b.glb`

## Acceptance

- GLB 3–12 MB (Draco OK)
- Y-up, origin bottom-center
- Four `anchor_*` nodes present
- Side-by-side lab viewer score >= 6/10 visual (target 8+ after iteration)
