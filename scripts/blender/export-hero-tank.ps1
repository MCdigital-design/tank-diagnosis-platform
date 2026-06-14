# Export tank_hero.glb from Blender (Windows)
$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$Blender = $env:BLENDER_BIN
if (-not $Blender) {
  $candidates = @(
    "${env:ProgramFiles}\Blender Foundation\Blender 4.2\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 4.1\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 3.6\blender.exe"
  )
  foreach ($c in $candidates) {
    if (Test-Path $c) { $Blender = $c; break }
  }
}
if (-not $Blender -or -not (Test-Path $Blender)) {
  Write-Host "Blender not found. Install Blender or set BLENDER_BIN."
  exit 1
}

& $Blender --background --python "$Root\scripts\blender\generate_hero_tank.py"
Write-Host "Done. Set VITE_HERO_TANK_MODE=glb and run: npm run dev"
