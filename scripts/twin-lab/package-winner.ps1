# Copy best available variant GLB to public/models/tank_hero.glb
# Priority: D -> C -> B -> A -> E -> F (override with -Variant X)
param(
  [ValidateSet("A", "B", "C", "D", "E", "F", "")]
  [string]$Variant = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$VariantsDir = Join-Path $Root "public\models\variants"
$HeroDir = Join-Path $Root "public\models"
$HeroPath = Join-Path $HeroDir "tank_hero.glb"
$Priority = @("D", "C", "B", "A", "E", "F")

New-Item -ItemType Directory -Force -Path $HeroDir | Out-Null

$chosen = $null
if ($Variant) {
  $candidate = Join-Path $VariantsDir "tank_$($Variant.ToLower()).glb"
  if (-not (Test-Path $candidate)) {
    Write-Error "Variant $Variant not found: $candidate"
  }
  $chosen = @{ Id = $Variant; Path = $candidate }
} else {
  foreach ($id in $Priority) {
    $candidate = Join-Path $VariantsDir "tank_$($id.ToLower()).glb"
    if (Test-Path $candidate) {
      $chosen = @{ Id = $id; Path = $candidate }
      break
    }
  }
}

if (-not $chosen) {
  Write-Host "No variant GLB found in $VariantsDir"
  Write-Host "Run: npm run twin-lab:download-c  OR  npm run twin-lab:export-d"
  exit 1
}

Copy-Item -Path $chosen.Path -Destination $HeroPath -Force
$mb = [math]::Round((Get-Item $HeroPath).Length / 1MB, 2)
Write-Host "Packaged Route $($chosen.Id) -> tank_hero.glb ($mb MB)"
Write-Host ""
Write-Host "Next:"
Write-Host "  1. Set VITE_HERO_TANK_MODE=glb in .env.local"
Write-Host "  2. npm run dev:v2 - verify dashboard hero tank"
Write-Host "  3. Update docs/TWIN-LAB-RESULT.md with winner scores"
