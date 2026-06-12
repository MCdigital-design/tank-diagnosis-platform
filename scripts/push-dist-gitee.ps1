# Push local dist/ to Gitee (master + pages). Requires Gitee private token.
# Usage: .\scripts\push-dist-gitee.ps1 -GiteeToken "..." [-Repo MCdigital-design/z-float]

param(
    [Parameter(Mandatory = $true)]
    [string]$GiteeToken,
    [string]$Repo = 'MCdigital-design/z-float'
)

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$Dist = Join-Path $Root 'dist'

if (-not (Test-Path (Join-Path $Dist 'index.html'))) {
    Write-Host 'Building preview dist...'
    Push-Location $Root
    npm run build:preview
    Pop-Location
}

Push-Location $Dist
git init
git config user.email 'deploy@local'
git config user.name 'local-deploy'
git add -A
git commit -m "deploy: $(Get-Date -Format o)" 2>$null
if ($LASTEXITCODE -ne 0) { git commit --allow-empty -m "deploy: $(Get-Date -Format o)" }

$base = "https://oauth2:$([uri]::EscapeDataString($GiteeToken))@gitee.com/$Repo.git"
git push -f "$base" HEAD:pages
git push -f "$base" HEAD:master
Pop-Location

Write-Host "Pushed dist to gitee:$Repo (pages + master)"
Write-Host 'If Gitee Pages is enabled: https://mcdigital-design.gitee.io/z-float/'
