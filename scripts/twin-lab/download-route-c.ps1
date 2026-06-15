# Route C — download catalog GLB candidates for public/models/variants/tank_c.glb
# Run: npm run twin-lab:download-c  OR  .\scripts\twin-lab\download-route-c.ps1
$ErrorActionPreference = "Stop"
$Root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Set-Location $Root

$OutDir = Join-Path $Root "public\models\variants"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$Dest = Join-Path $OutDir "tank_c.glb"

# Primary: Quaternius Water Tank (CC0) via Poly Pizza CDN — automated
$Primary = @{
  Name = "Quaternius Water Tank (CC0)"
  Url = "https://static.poly.pizza/90ce7828-ec94-4b41-9e44-e524af7aafa5.glb"
  License = "CC0"
  Source = "https://poly.pizza/m/XVB8vUbnZb"
}

# Manual-only candidates (Sketchfab/CGTrader require browser login)
$Manual = @(
  @{
    Name = "Sketchfab — Avanya floating-roof oil tank"
    Url = "https://sketchfab.com/avanya/collections/oil-industry-48e65c85762447628b68e2672124ba76"
    License = "Check per model"
    Note = "Download GLB in browser → save as tank_c.glb"
  },
  @{
    Name = "CGTrader — Factory huge Oil Storage tank (free)"
    Url = "https://www.cgtrader.com/free-3d-models/industrial/other/factory-huge-oil-storage-tank"
    License = "Royalty Free"
    Note = "Select glTF/GLB format after free account login"
  },
  @{
    Name = "Sketchfab — Free Liquid Storage Tank (CC-BY)"
    Url = "https://sketchfab.com/3d-models/free-liquid-storage-tank-e78a9437b07e43d8bcbe455a3dcc994c"
    License = "CC Attribution"
    Note = "Horizontal tank; scale in Blender to match heroTankSpec"
  },
  @{
    Name = "GetGLB — Rusty Storage Tank (CC-BY)"
    Url = "https://www.getglb.com/architecture/rusty-storage-tank/"
    License = "CC Attribution"
    Note = "Use site Download button; no stable direct URL"
  }
)

function Try-Download($Url, $OutFile) {
  Write-Host "Trying: $Url"
  Invoke-WebRequest -Uri $Url -OutFile $OutFile -UseBasicParsing -TimeoutSec 120
  $size = (Get-Item $OutFile).Length
  if ($size -lt 1024) {
    Remove-Item $OutFile -Force
    throw "Download too small ($size bytes) — likely blocked or HTML error page"
  }
  return $size
}

Write-Host "=== Route C catalog download ===" -ForegroundColor Cyan
Write-Host "Target: $Dest"

try {
  $bytes = Try-Download $Primary.Url $Dest
  $mb = [math]::Round($bytes / 1MB, 2)
  Write-Host "OK: $($Primary.Name)" -ForegroundColor Green
  Write-Host "  Size: $mb MB"
  Write-Host "  License: $($Primary.License)"
  Write-Host "  Source: $($Primary.Source)"
  Write-Host ""
  Write-Host "Verify in lab viewer: npm run dev:lab  →  ?variant=C"
  exit 0
} catch {
  Write-Host "Automated download failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Manual download required. Open one of these URLs in a browser:" -ForegroundColor Yellow
foreach ($m in $Manual) {
  Write-Host "  • $($m.Name)"
  Write-Host "    $($m.Url)"
  Write-Host "    License: $($m.License) — $($m.Note)"
  Write-Host ""
}
Write-Host "Save file to: $Dest"
exit 1
