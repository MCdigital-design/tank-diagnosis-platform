# Version index

Baseline releases for the **储罐运行诊断指挥平台**. Use these tags to return to a known-good state.

| Version | Git tag | Date | Summary |
|---------|---------|------|---------|
| **v1 (ground zero)** | `v1.0.0` | 2026-06-03 | Interactive 3D tanks, fixed ID card dock, selection link, scaled pointer fix |

## v1.0.0 — ground zero

**Tag:** `v1.0.0`

### Included

- Dashboard shell (1920×1080 scaled layout), mock data, ECharts panels
- Central **WebGL** scene: two tanks, orbit controls, hover highlight, accurate click picking under CSS `scale()`
- **Screen-fixed ID card** (right dock), pin / close, dashboard sync
- **Green leader line**: floating-roof top → ID card (DOM loop outside Canvas; safe for WebGL)
- Dev scripts: `npm run dev:bg`, `dev:stop`, port `5173`

### Key paths

- `src/components/scene/TankScene3D.tsx` — 3D scene + overlays
- `src/components/scene/scaledCanvasEvents.ts` — pointer / raycast alignment
- `src/components/scene/useSelectionLinkLoop.ts` — link overlay
- `src/context/TankSelectionContext.tsx` — global tank selection

### Restore this version

```bash
git fetch --all   # if using a remote later
git checkout v1.0.0
npm install
npm run dev:bg
```

To branch from v1 without detaching HEAD:

```bash
git checkout -b my-feature v1.0.0
```

### Create tag again (maintainers)

Only if the tag was lost locally:

```bash
git tag -a v1.0.0 -m "v1 ground zero: 3D tanks, ID card dock, leader line, pointer fix"
```
