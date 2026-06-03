# Detached Vite — frees the IDE terminal; URL: http://127.0.0.1:5173/

$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$PidFile = Join-Path $Root '.dev-server.pid'
$LogFile = Join-Path $Root 'dev-server.log'
$Url = 'http://127.0.0.1:5173/'

function Test-ServerUp {
    try {
        $null = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
        return $true
    } catch {
        return $false
    }
}

if (Test-ServerUp) {
    Write-Host "Dev server already running at $Url"
    exit 0
}

if (Test-Path $PidFile) {
    $oldPid = [int](Get-Content $PidFile -Raw).Trim()
    Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 300
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
}

$viteBin = Join-Path $Root 'node_modules\vite\bin\vite.js'
if (-not (Test-Path $viteBin)) {
    Write-Host 'Run npm install first.'
    exit 1
}

"=== dev server $(Get-Date -Format o) ===" | Out-File -FilePath $LogFile -Encoding utf8

$proc = Start-Process `
    -FilePath 'node' `
    -ArgumentList "`"$viteBin`"" `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -PassThru `
    -RedirectStandardOutput $LogFile `
    -RedirectStandardError (Join-Path $Root 'dev-server.err.log')

$proc.Id | Out-File -FilePath $PidFile -Encoding ascii -NoNewline

$deadline = (Get-Date).AddSeconds(30)
while ((Get-Date) -lt $deadline) {
    if (Test-ServerUp) {
        Write-Host "Dev server running at $Url (PID $($proc.Id), log: dev-server.log)"
        exit 0
    }
    if ($proc.HasExited) {
        Write-Host 'Dev server exited early. See dev-server.log'
        exit 1
    }
    Start-Sleep -Milliseconds 300
}

Write-Host "Started PID $($proc.Id) - open $Url when ready (log: dev-server.log)"
