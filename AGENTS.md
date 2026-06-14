# AGENTS.md

## Cursor Cloud specific instructions

This is a frontend-only React + Vite + TypeScript dashboard (储罐运行诊断指挥平台). There is no backend; data comes from `src/data/mock.ts` and `src/data/floatingRoofSensors.ts`.

### Services

Single service: the Vite dev server on a fixed `http://127.0.0.1:5173/` (`strictPort: true` in `vite.config.ts`, so it errors instead of switching ports if 5173 is busy).

### Running / building / testing

- Run dev server: `npm run dev` (foreground). Do NOT use `npm run dev:bg` / `npm run dev:stop` / `npm run start` on Linux — those scripts shell out to PowerShell (`scripts/*.ps1`) and only work on Windows.
- Build: `npm run build` (runs `tsc -b && vite build`). This is also the only type-check step; there is no separate `lint` script.
- Preview built output: `npm run preview` (also fixed to port 5173).
- There is no automated test suite.

### Notes

- Local dev needs no env vars. The `.env.example` / `VITE_PREVIEW_AUTH` settings are only for the gated GitHub Pages / Gitee preview deploy; leave `VITE_PREVIEW_AUTH` unset/false for normal development.
- The core feature is the central WebGL 3D scene (`src/components/scene/TankScene3D.tsx`): tanks are clickable (open a right-side info card) and roof sensor dots are clickable (open sensor time-series details).
