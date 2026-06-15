# Twin-Lab 3-day sprint autopilot — check variants, run Route D, print next actions
# Run: npm run sprint:autopilot
$ErrorActionPreference = "Continue"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$VariantsDir = Join-Path $Root "public\models\variants"
$HeroPath = Join-Path $Root "public\models\tank_hero.glb"
$Priority = @("D", "C", "B", "A", "E", "F")
$RouteScripts = @{
  D = "npm run twin-lab:export-d"
  C = "npm run twin-lab:download-c"
  B = "See scripts/twin-lab/route-b-meshy.md + route-b-meshy-cleanup agent"
  A = "Invoke route-a-blender-mcp agent (Blender MCP required)"
  E = "See twin-lab/unity/EXPORT.md"
  F = "See twin-lab/unreal/EXPORT.md"
}

Write-Host ""
Write-Host "=== Twin-Lab Sprint Autopilot ===" -ForegroundColor Cyan
Write-Host "Branch: $(git branch --show-current 2>$null)"
Write-Host ""

# 1. Route D export attempt
Write-Host "[1/4] Route D — Blender baseline export..." -ForegroundColor Yellow
& (Join-Path $Root "scripts\twin-lab\export-route-d.ps1")
$dExit = $LASTEXITCODE
if ($dExit -ne 0) {
  Write-Host "  Route D blocked (Blender not installed or export failed)." -ForegroundColor DarkYellow
  Write-Host "  Fix: Install Blender 3.6+ or set BLENDER_BIN, then re-run." -ForegroundColor DarkYellow
}

# 2. Scan variants
Write-Host ""
Write-Host "[2/4] Variant GLB inventory:" -ForegroundColor Yellow
$found = @()
foreach ($id in $Priority) {
  $file = Join-Path $VariantsDir "tank_$($id.ToLower()).glb"
  if (Test-Path $file) {
    $mb = [math]::Round((Get-Item $file).Length / 1MB, 2)
    Write-Host "  [OK] tank_$($id.ToLower()).glb  ($mb MB)" -ForegroundColor Green
    $found += $id
  } else {
    Write-Host "  [--] tank_$($id.ToLower()).glb  missing" -ForegroundColor DarkGray
  }
}

if (Test-Path $HeroPath) {
  $mb = [math]::Round((Get-Item $HeroPath).Length / 1MB, 2)
  Write-Host "  [OK] tank_hero.glb  ($mb MB)" -ForegroundColor Green
} else {
  Write-Host "  [--] tank_hero.glb  missing" -ForegroundColor DarkGray
}

# 3. Build check
Write-Host ""
Write-Host "[3/4] Build check..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
  Write-Host "  npm run build — PASS" -ForegroundColor Green
} else {
  Write-Host "  npm run build — FAIL (fix TypeScript/Vite errors)" -ForegroundColor Red
}

# 4. Next actions
Write-Host ""
Write-Host "[4/4] Recommended next actions (priority D->C->B->A->E->F):" -ForegroundColor Yellow
$next = $Priority | Where-Object { $_ -notin $found } | Select-Object -First 1
if ($next) {
  Write-Host "  Next route: $next" -ForegroundColor Cyan
  Write-Host "  Command: $($RouteScripts[$next])"
} else {
  Write-Host "  All variant slots filled. Run package-winner and compare in dev:lab." -ForegroundColor Green
  Write-Host "  Command: npm run twin-lab:package-winner"
}

Write-Host ""
Write-Host "Lab viewer:  npm run dev:lab"
Write-Host "Sprint check:  npm run sprint:check"
Write-Host "Autopilot agent: invoke twin-lab-autopilot (every 2–4h via /loop or Automations)"
Write-Host "Matrix:        docs/TWIN-LAB-MATRIX.md"
Write-Host ""
