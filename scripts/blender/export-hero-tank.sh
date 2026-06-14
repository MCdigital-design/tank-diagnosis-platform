#!/usr/bin/env bash
# Export tank_hero.glb from Blender using hero_tank_spec.json
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BLENDER="${BLENDER_BIN:-blender}"
if ! command -v "$BLENDER" >/dev/null 2>&1; then
  echo "Blender not found. Install Blender 3.6+ and set BLENDER_BIN if needed."
  echo "Windows example: BLENDER_BIN=\"/c/Program Files/Blender Foundation/Blender 4.2/blender.exe\" $0"
  exit 1
fi

"$BLENDER" --background --python "$ROOT/scripts/blender/generate_hero_tank.py"
echo "Done. Set VITE_HERO_TANK_MODE=glb and run: npm run dev"
