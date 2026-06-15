# Unreal Lumen → GLB / stills (Route F)

Project folder: `twin-lab/unreal/` (create locally).

## Steps

1. Create UE 5.3+ project in `twin-lab/unreal/`
2. Import best GLB or FBX from Week 1
3. Enable **Lumen**; tune industrial dusk lighting to match mock mood
4. High-res PBR textures (2K max per hero material for web export)
5. **Turntable stills** (required):
   - Render 3840×2160 frames to `twin-lab/screenshots/f_reference/`
   - Match `hero45` and `aerial` framing
6. **GLB export** (optional):
   - Use glTF Exporter or Datasmith → Blender → GLB
   - If > 12 MB or broken materials, score Route F on **stills only**

## Gitignore

```
twin-lab/unreal/Saved/
twin-lab/unreal/Intermediate/
twin-lab/unreal/DerivedDataCache/
```

## Fair comparison rule

If GLB export fails, document in `docs/TWIN-LAB-MATRIX.md` — F does not block winner if A/C/E score >= 8/10.
