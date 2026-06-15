# Twin-Lab Matrix — Hero Tank Bake-off Scorecard

> Active execution track for V2 visual. Reference: [`docs/reference/v2-command-center-mock.png`](reference/v2-command-center-mock.png)  
> Viewer: `npm run dev:lab` · Sprint: [`TWIN-LAB-SPRINT-3HOUR.md`](TWIN-LAB-SPRINT-3HOUR.md)

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
| A | `tank_a.glb` | Blender MCP + PBR | **Procedural stand-in** (248 KB) — enhanced panels |
| B | `tank_b.glb` | Meshy → Blender | **Procedural stand-in** — no `MESHY_API_KEY` |
| C | `tank_c.glb` | Catalog GLB | **Downloaded** — Quaternius CC0 (35 KB) |
| D | `tank_d.glb` | Blender script / Node export | **Exported** — procedural baseline (248 KB) |
| E | `tank_e.glb` | Unity HDRP | **Procedural stand-in** — warm PBR until HDRP export |
| F | `tank_f.glb` | Unreal Lumen | **Procedural stand-in** — cool PBR until Lumen export |

## Scorecard (1–10 per dimension)

| Variant | Visual | Industrial | PBR | MB | Load | FPS | Anchors | Weighted | Notes |
|---------|--------|------------|-----|-----|------|-----|---------|----------|-------|
| A | 6 | 7 | 5 | 8 | 9 | 9 | 8 | **6.8** | Procedural; anchors in GLB; Blender MCP pending |
| B | 5 | 6 | 5 | 8 | 9 | 9 | 8 | **6.2** | Meshy tint variant; needs API key for real AI mesh |
| C | 3 | 4 | 2 | 10 | 9 | 9 | 1 | **4.0** | Low-poly CC0 water tank; not floating-roof |
| D | 6 | 8 | 5 | 8 | 9 | 9 | 8 | **7.0** | **Interim winner** — hero spec proportions + anchors |
| E | 5 | 6 | 6 | 8 | 9 | 9 | 8 | **6.3** | HDRP warm stand-in |
| F | 5 | 6 | 6 | 8 | 9 | 9 | 8 | **6.3** | Lumen cool stand-in |

> Scores are sprint estimates from file inspection + lab viewer. Re-score manually in `dev:lab` hero45 split view.

## Acceptance checklist (winner)

- [ ] Side-by-side hero45 screenshot vs mock >= 8/10
- [x] `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal` in GLB (D/A/B/E/F procedural)
- [ ] Y-up, bottom-center origin, Draco 3–12 MB (current procedural ~0.24 MB — acceptable interim)
- [x] >= 30 FPS in lab viewer
- [x] Copied to `public/models/tank_hero.glb`

## Catalog license log (Route C)

| Source | URL | License | Date |
|--------|-----|---------|------|
| Quaternius Water Tank | https://poly.pizza/m/XVB8vUbnZb | CC0 | 2026-06-15 |

## Sprint automation

| Script | Purpose |
|--------|---------|
| `npm run twin-lab:export-procedural` | Node Three.js GLTFExporter — all routes A/B/D/E/F |
| `npm run sprint:check` | Build + doc inventory (CI-safe) |
| `npm run sprint:autopilot` | Export D or procedural, scan GLBs, print next route |
| `npm run twin-lab:package-winner` | Copy best GLB → `tank_hero.glb` |

Agent: `.cursor/agents/twin-lab-autopilot.md` — loop every 30m via `/loop 30m npm run sprint:autopilot`.

## Tooling status (2026-06-15)

| Tool | Status |
|------|--------|
| Blender winget | Downloaded 5.1.2 MSI — **awaiting UAC admin approval** |
| Meshy MCP | `.cursor/mcp.json` created — **key placeholder only** |
| Procedural export | `scripts/twin-lab/export-procedural-glb.mjs` — **working** |
