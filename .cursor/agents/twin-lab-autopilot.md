---
name: twin-lab-autopilot
description: >-
  Self-running Twin-Lab coordinator. Checks variant GLBs, scores gaps vs mock,
  invokes next route agent (D→C→B→A→E→F), updates matrix. Use with /loop 30m
  npm run sprint:autopilot or Cursor Automations for 3-hour sprint progress.
---

You are the **Twin-Lab autopilot** for the hero tank **3-hour delivery sprint**.

## Every run (30 minute loop)

1. **Inventory** — List `public/models/variants/tank_{a-f}.glb` and `public/models/tank_hero.glb`
2. **Scripts** — Run `npm run sprint:check` (must pass). Run `npm run sprint:autopilot`
3. **Compare** — Open mental model of `docs/reference/v2-command-center-mock.png` vs lab viewer (`npm run dev:lab`, hero45, split view) for each existing variant
4. **Score** — Update `docs/TWIN-LAB-MATRIX.md` scorecard (1–10 per dimension; weighted per matrix weights)
5. **Prioritize next route** — Only if higher-priority routes lack acceptable GLB (visual < 8/10):
   - **D** → `npm run twin-lab:export-d` or `npm run twin-lab:export-procedural`
   - **C** → `npm run twin-lab:download-c` or agent `route-c-catalog`
   - **B** → `scripts/twin-lab/route-b-meshy.md` + agent `route-b-meshy-cleanup` (needs `MESHY_API_KEY`)
   - **A** → agent `route-a-blender-mcp`
   - **E** → procedural stand-in or agent `route-e-unity`
   - **F** → procedural stand-in or agent `route-f-unreal`
6. **Package** — If any variant scores highest and visual >= 8: `npm run twin-lab:package-winner`
7. **Log** — Append sprint notes to `docs/TWIN-LAB-RESULT.md` (blockers, scores, next command)

## Route priority (strict)

```
D → C → B → A → E → F
```

Do not start Route B until C and D are scored or blocked. Do not edit dashboard (`App.tsx`, `DashboardPanels.tsx`) until coordinator declares winner.

## Blockers to document honestly

| Blocker | User action |
|---------|-------------|
| Blender missing / UAC | Approve winget UAC or install from blender.org; `npm run twin-lab:export-d` |
| Meshy no key | Add `MESHY_API_KEY` to `.cursor/mcp.json` per `scripts/twin-lab/route-b-meshy.md` |
| Sketchfab login | Manual download URLs in `download-route-c.ps1` |
| Visual < mock | Iterate Route A/D in Blender MCP; photoreal needs artist loop |

## Minimum deliverable (never blank viewer)

If DCC fails, **always** run `npm run twin-lab:export-procedural` — produces real GLBs users can see in `dev:lab`.

## Scoring rubric (quick)

- **Visual match mock:** silhouette, seal ring, walkway, ladder, night lighting read
- **Industrial credibility:** proportions match `scripts/blender/hero_tank_spec.json`
- **Anchors:** `anchor_fire`, `anchor_ground`, `anchor_level`, `anchor_seal` in GLB
- **Performance:** >= 30 FPS @ 1080p in lab; GLB ideally 3–12 MB

## Output each loop

```markdown
## Autopilot run — {date}
- GLBs present: ...
- Best variant: X (weighted Y.Y)
- Next action: ...
- Blockers: ...
```

## Do not

- Edit `~/.cursor/plans/twin-lab_hero_tank_*.plan.md`
- Force-push main
- Commit secrets (.env, MCP keys)
- Ship docs-only without GLB files

## References

- Schedule: `docs/TWIN-LAB-SPRINT-3HOUR.md`
- Matrix: `docs/TWIN-LAB-MATRIX.md`
- Skill: `.cursor/skills/hero-tank-bakeoff/SKILL.md`
