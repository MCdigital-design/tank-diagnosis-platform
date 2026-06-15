# Export Route D baseline to public/models/variants/tank_d.glb
$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$OutDir = Join-Path $Root "public\models\variants"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$Blender = $env:BLENDER_BIN
if (-not $Blender) {
  $candidates = @(
    "${env:ProgramFiles}\Blender Foundation\Blender 4.3\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 4.2\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 4.1\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 4.0\blender.exe",
    "${env:ProgramFiles}\Blender Foundation\Blender 3.6\blender.exe",
    "${env:ProgramFiles(x86)}\Blender Foundation\Blender 3.6\blender.exe",
    "${env:LOCALAPPDATA}\Programs\Blender Foundation\Blender 4.2\blender.exe"
  )
  $pf = "${env:ProgramFiles}\Blender Foundation"
  if (Test-Path $pf) {
    Get-ChildItem -Path $pf -Filter blender.exe -Recurse -ErrorAction SilentlyContinue |
      ForEach-Object { $candidates += $_.FullName }
  }
  foreach ($c in $candidates) {
    if (Test-Path $c) { $Blender = $c; break }
  }
}

if (-not $Blender -or -not (Test-Path $Blender)) {
  Write-Host "Blender not found. Install Blender or set BLENDER_BIN."
  Write-Host "  .\scripts\blender\export-hero-tank.ps1"
  Write-Host "  Copy-Item public\models\tank_hero.glb public\models\variants\tank_d.glb"
  exit 1
}

$SpecPath = Join-Path $Root "scripts\blender\hero_tank_spec.json"
$backup = Get-Content $SpecPath -Raw
try {
  $patched = $backup -replace '"output":\s*"[^"]*"', '"output": "../../public/models/variants/tank_d.glb"'
  Set-Content -Path $SpecPath -Value $patched -Encoding UTF8
  & $Blender --background --python (Join-Path $Root "scripts\blender\generate_hero_tank.py")
} finally {
  Set-Content -Path $SpecPath -Value $backup -Encoding UTF8
}

$dest = Join-Path $OutDir "tank_d.glb"
if (Test-Path $dest) {
  Write-Host "Route D exported: $dest"
} else {
  Write-Host "Export failed - check Blender output."
  exit 1
}
