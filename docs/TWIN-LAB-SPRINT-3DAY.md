# Twin-Lab 3-Day Sprint Schedule

> Compressed from the 3-week plan in `twin-lab/routes/WEEK*.md`.  
> Reference mock: [`docs/reference/v2-command-center-mock.png`](reference/v2-command-center-mock.png)  
> **Do not edit** the Cursor plan file at `~/.cursor/plans/twin-lab_hero_tank_*.plan.md`.

## Constraints (be honest)

| Can automate | Cannot automate (local PC only) |
|--------------|----------------------------------|
| Build, lab viewer, variant inventory scripts | Blender GUI / Blender MCP sculpting |
| Route C CDN download (`download-route-c.ps1`) | Sketchfab/CGTrader login downloads |
| Sprint check CI stub | Unity HDRP / Unreal Lumen exports |
| Autopilot agent loop prompts | Photoreal PBR iteration to mock parity |
| Package winner script | Meshy without API key |

Cloud agents and GitHub Actions **cannot** run Blender, Unity, or Unreal. All export routes require your Windows workstation.

---

## Day 1 — Scaffold + first GLBs (Hours 0–8)

| Hour | Task | Command / agent |
|------|------|-----------------|
| 0–1 | Verify build + lab viewer | `npm run build` · `npm run dev:lab` |
| 1–2 | Route D baseline | `npm run twin-lab:export-d` (needs Blender) |
| 2–3 | Route C catalog | `npm run twin-lab:download-c` |
| 3–4 | Sprint scripts + npm hooks | `npm run sprint:check` |
| 4–5 | Create autopilot agent + rule | `.cursor/agents/twin-lab-autopilot.md` |
| 5–6 | Compare C vs mock in lab | `?variant=C` hero45 camera, split view |
| 6–7 | Document blockers in matrix | Edit `docs/TWIN-LAB-MATRIX.md` |
| 7–8 | First autopilot loop | `/loop 3h npm run sprint:autopilot` |

**Day 1 exit:** At least `tank_c.glb` OR `tank_d.glb` OR documented download script; build green.

---

## Day 2 — AI + polish routes (Hours 8–16)

| Hour | Task | Command / agent |
|------|------|-----------------|
| 8–9 | Meshy MCP setup | `scripts/twin-lab/route-b-meshy.md` |
| 9–11 | Route B draft | Agent `route-b-meshy-cleanup` |
| 11–12 | Route A Blender MCP | Agent `route-a-blender-mcp` |
| 12–13 | Re-score all variants in lab | Update matrix scorecard |
| 13–14 | Lab default = best GLB | Auto-select D→C→B→A→E→F |
| 14–15 | Package interim winner | `npm run twin-lab:package-winner` |
| 15–16 | Dashboard smoke test | `VITE_HERO_TANK_MODE=glb npm run dev:v2` |

**Day 2 exit:** Route B or A attempted; matrix has at least 2 scored rows; `tank_hero.glb` if any route acceptable.

---

## Day 3 — Handoff + automation (Hours 16–24)

| Hour | Task | Command / agent |
|------|------|-----------------|
| 16–17 | Routes E/F only if A–D < 8/10 visual | `route-e-unity` / `route-f-unreal` |
| 17–18 | Final bake-off session | Agent `twin-lab-coordinator` |
| 18–19 | Copy winner → `tank_hero.glb` | `npm run twin-lab:package-winner -Variant X` |
| 19–20 | Update TWIN-LAB-RESULT.md | Winner route + SOP |
| 20–21 | CI sprint check stub | `.github/workflows/twin-lab-check.yml` |
| 21–22 | Commit + push branch | `twin-lab/hero-tank` |
| 22–24 | Enable recurring autopilot | Cursor Automation or `/loop 4h` |

**Day 3 exit:** Production-ready `tank_hero.glb` or documented interim (DetailedTank) + full automation docs.

---

## Route priority

```
D (Blender script) → C (catalog) → B (Meshy) → A (Blender MCP) → E (Unity) → F (Unreal)
```

## Quick commands

```powershell
npm run build                  # verify scaffold
npm run dev:lab                # side-by-side mock comparison
npm run twin-lab:export-d      # Route D (Blender required)
npm run twin-lab:download-c    # Route C catalog
npm run sprint:check           # local/CI status
npm run sprint:autopilot       # export-d + inventory + next steps
npm run twin-lab:package-winner  # best GLB → tank_hero.glb
```

## Autopilot loop (self-running)

In Cursor chat:

```
/loop 4h Run npm run sprint:autopilot, then invoke twin-lab-autopilot agent to score variants vs mock and update TWIN-LAB-MATRIX
```

Or create a Cursor Automation targeting this repo on a 4-hour schedule.

## If no photoreal GLB by Day 3

1. Keep `VITE_HERO_TANK_MODE=procedural` (DetailedTank) for demo
2. Log exact manual steps for Route D/A in `docs/TWIN-LAB-RESULT.md`
3. Continue autopilot loops until Blender/Meshy produce acceptable `tank_d.glb` or `tank_b.glb`
