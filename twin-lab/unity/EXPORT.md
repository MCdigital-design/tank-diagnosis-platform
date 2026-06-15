# Unity HDRP → GLB (Route E)

Project folder: `twin-lab/unity/` (create locally; `Library/` is gitignored).

## Steps

1. Create Unity 2022 LTS+ project with **HDRP** template in `twin-lab/unity/`
2. Import best Week-1 GLB (`tank_a.glb` or `tank_c.glb`) via UnityGLTF or FBX round-trip
3. Assign HDRP Lit materials:
   - Shell: painted steel
   - Roof: galvanized
   - Rails: safety yellow
4. Add **LOD Group** (LOD0 hero, LOD1 simplified)
5. Bake lighting / AO if using static lights
6. Export with [UnityGLTF](https://github.com/KhronosGroup/UnityGLTF) or glTFast:
   - Y-up, apply transforms
   - Include `anchor_*` transforms as empty nodes
7. Copy to `public/models/variants/tank_e.glb`
8. Verify `npm run dev:lab/?variant=E`

## Size budget

Decimate LOD0 if export > 12 MB. Run Draco in Blender post-pass if needed.

## Gitignore

Add to repo `.gitignore`:

```
twin-lab/unity/Library/
twin-lab/unity/Logs/
twin-lab/unity/Temp/
```
