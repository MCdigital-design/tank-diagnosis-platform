# Local-only sprint status (no secrets, no network). Used by CI stub and npm run sprint:check.
$ErrorActionPreference = "Continue"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$VariantsDir = Join-Path $Root "public\models\variants"
$Priority = @("D", "C", "B", "A", "E", "F")
$errors = 0

Write-Host "Twin-Lab sprint check"

# Required docs
$requiredDocs = @(
  "docs\TWIN-LAB-SPRINT-3DAY.md",
  "docs\TWIN-LAB-MATRIX.md",
  ".cursor\agents\twin-lab-autopilot.md"
)
foreach ($doc in $requiredDocs) {
  $p = Join-Path $Root $doc
  if (-not (Test-Path $p)) {
    Write-Host "MISSING: $doc"
    $errors++
  }
}

# At least one variant or documented download script
$anyGlb = Get-ChildItem -Path $VariantsDir -Filter "*.glb" -ErrorAction SilentlyContinue
$downloadScript = Join-Path $Root "scripts\twin-lab\download-route-c.ps1"
if (-not $anyGlb -and -not (Test-Path $downloadScript)) {
  Write-Host "MISSING: no variant GLBs and no download-route-c.ps1"
  $errors++
}

# Build
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "FAIL: npm run build"
  $errors++
} else {
  Write-Host "PASS: npm run build"
}

# Inventory
foreach ($id in $Priority) {
  $f = Join-Path $VariantsDir "tank_$($id.ToLower()).glb"
  if (Test-Path $f) {
    $mb = [math]::Round((Get-Item $f).Length / 1MB, 2)
    Write-Host "GLB: tank_$($id.ToLower()).glb ($mb MB)"
  }
}

if ($errors -gt 0) {
  Write-Host "Sprint check: $errors issue(s)"
  exit 1
}
Write-Host "Sprint check: OK"
exit 0
