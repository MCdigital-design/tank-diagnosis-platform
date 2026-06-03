$Root = Resolve-Path (Join-Path $PSScriptRoot '..')
$PidFile = Join-Path $Root '.dev-server.pid'

if (-not (Test-Path $PidFile)) {
    Write-Host 'No dev-server.pid — server may already be stopped.'
    exit 0
}

$serverPid = [int](Get-Content $PidFile -Raw).Trim()
$proc = Get-Process -Id $serverPid -ErrorAction SilentlyContinue
if ($proc) {
    Stop-Process -Id $serverPid -Force
    Write-Host "Stopped dev server (PID $serverPid)."
} else {
    Write-Host "Process $serverPid not found."
}

Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
