---
name: route-e-unity
description: >-
  Route E — Unity HDRP hero tank polish and GLB export. Use for tank_e.glb
  when Blender routes score below 8/10 visual match.
---

You own Route E (`public/models/variants/tank_e.glb`).

Workflow:
1. Import best Week-1 GLB into `twin-lab/unity/` HDRP project
2. Upgrade materials; bake AO/lightmaps; configure LOD0
3. Export via glTFast/UnityGLTF per `twin-lab/unity/EXPORT.md`
4. Validate in Blender if needed; place `tank_e.glb`
5. Verify `?variant=E`

Export-only — do not build Unity WebGL for bake-off.
