# Version index

Baseline releases for the **储罐运行诊断指挥平台**. Use these tags to return to a known-good state.

| Version | Git tag | Date | Summary |
|---------|---------|------|---------|
| **v1.1 (foundation)** | `v1.1.0` | 2026-06-03 | TG04 floating-roof IoT, sensor 3D markers, readable UI + 字号 control; stable v1 grid layout |
| **v1 (ground zero)** | `v1.0.0` | 2026-06-03 | Interactive 3D tanks, fixed ID card dock, selection link, scaled pointer fix |

**Recommended starting point for new work:** `v1.1.0`

---

## v1.1.0 — foundation (floating roof IoT + readability)

**Tag:** `v1.1.0`

Build on this tag for all new features (resize gutters, API wiring, more tanks, etc.).

### Included

**3D & selection (from v1, extended)**

- Two tanks, orbit controls, scaled pointer fix (`scaledCanvasEvents.ts`)
- Screen-fixed ID card dock + leader line (roof center or selected sensor)
- Tank / sensor selection via `TankSelectionContext`

**Floating roof IoT (TG04-aligned)**

- `src/data/floatingRoofSensors.ts` — rim/mid/inner ring layout, traffic-light thresholds, 24h demo series
- **储罐02** → **TG04** (18 temp + 10 level markers + tilt data); **储罐01** → simplified 8-point demo
- `RoofSensorMarkers.tsx` — clickable green / yellow / red spheres on floating roof
- `SensorDetailCard.tsx` + `SensorTimeSeriesChart` — per-point detail and trend
- ID card: device inventory, status counts, alarm point shortcuts
- Left **浮盘设备信息** when tank focused; footer **浮盘传感实时** (4-column footer grid when sensors active)
- Alerts linked to sensors (`T4_1`, `T4_3`, `T4_4`); click alert to jump to point

**UI stability & readability**

- Fixed footer layout: `footer--with-sensors` uses 4 columns (fixes corruption when ID card opens)
- Side columns scroll (`overflow-y: auto`); footer panels scroll
- Header **字号** control: 标准 / 大 / 特大 (`DisplayPreferencesContext`, default **大**)
- Larger base typography and improved contrast on hints and tables

**Explicitly not in v1.1**

- Draggable panel resize gutters (removed after collapse issues; planned as a follow-up on top of v1.1)

### Key paths

| Area | Path |
|------|------|
| Sensor data | `src/data/floatingRoofSensors.ts` |
| 3D scene | `src/components/scene/TankScene3D.tsx`, `RoofSensorMarkers.tsx` |
| Selection | `src/context/TankSelectionContext.tsx` |
| Font scale | `src/context/DisplayPreferencesContext.tsx`, `FontSizeControl.tsx` |
| Layout shell | `src/App.tsx`, `DashboardPanels.tsx` |

### Restore / branch from v1.1

```bash
git checkout v1.1.0
npm install
npm run dev:bg
```

Open http://127.0.0.1:5173/

Branch for new work:

```bash
git checkout -b feature/my-work v1.1.0
```

### Quick test checklist

1. Left/right panels fully visible (no collapsed strips).
2. Click **储罐02** → roof markers + ID card + footer sensor row (4 panels).
3. Click red marker **T4_1** → sensor detail + chart; leader line follows point.
4. Header **特大** → text grows; refresh keeps choice.

---

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

### Restore v1.0 only

```bash
git checkout v1.0.0
npm install
npm run dev:bg
```
