# One-time Gitee preview setup: create private repo, set GitHub Secrets, trigger deploy.
# Usage:
#   .\scripts\setup-gitee.ps1 -GiteeToken "your_gitee_private_token"
#
# Get token: Gitee → 头像 → 设置 → 私人令牌 → projects 权限

param(
    [Parameter(Mandatory = $true)]
    [string]$GiteeToken,

    [string]$RepoName = 'z-float',
    [string]$GithubRepo = 'MCdigital-design/tank-diagnosis-platform'
)

$ErrorActionPreference = 'Stop'

function Invoke-GiteeApi {
    param([string]$Method, [string]$Path, [hashtable]$Body = @{})
    $qs = "access_token=$([uri]::EscapeDataString($GiteeToken))"
    $uri = "https://gitee.com/api/v5$Path" + $(if ($Path -match '\?') { '&' } else { '?' }) + $qs
    if ($Method -eq 'GET') {
        return Invoke-RestMethod -Uri $uri -Method Get
    }
    return Invoke-RestMethod -Uri $uri -Method Post -Body ($Body | ConvertTo-Json) -ContentType 'application/json; charset=utf-8'
}

Write-Host 'Fetching Gitee user...'
$user = Invoke-GiteeApi -Method GET -Path '/user'
$giteeUser = $user.login
$giteeRepo = "$giteeUser/$RepoName"
Write-Host "Gitee user: $giteeUser"

Write-Host "Checking repo $giteeRepo ..."
$exists = $false
try {
    $null = Invoke-GiteeApi -Method GET -Path "/repos/$giteeUser/$RepoName"
    $exists = $true
    Write-Host 'Repo already exists — skipping create.'
} catch {
    Write-Host 'Creating private repo...'
    $null = Invoke-GiteeApi -Method POST -Path '/user/repos' -Body @{
        name        = $RepoName
        description = '储罐运行诊断指挥平台 — preview deploy (pages branch)'
        private     = $true
        has_issues  = $false
        has_wiki    = $false
        auto_init   = $false
    }
    Write-Host "Created https://gitee.com/$giteeRepo"
}

$gh = Get-Command gh -ErrorAction SilentlyContinue
if (-not $gh) {
    Write-Warning 'gh CLI not found — set secrets manually in GitHub Settings.'
} else {
    Write-Host 'Setting GitHub Secrets...'
    gh secret set GITEE_TOKEN --repo $GithubRepo --body $GiteeToken
    gh secret set GITEE_REPO --repo $GithubRepo --body $giteeRepo
    if (-not (gh secret list --repo $GithubRepo 2>$null | Select-String 'PREVIEW_USER')) {
        gh secret set PREVIEW_USER --repo $GithubRepo --body 'Z-Float'
        gh secret set PREVIEW_PASS --repo $GithubRepo --body '008AAA'
    }
    Write-Host 'Triggering Deploy Gitee Pages workflow...'
    gh workflow run deploy-gitee-pages.yml --repo $GithubRepo -f label=initial-setup
}

Write-Host ''
Write-Host '=== Done ==='
Write-Host "Gitee repo: https://gitee.com/$giteeRepo"
Write-Host 'Next (in Gitee web UI): 仓库 → 服务 → Gitee Pages → 分支选 pages → 启动'
Write-Host 'After Pages enabled, re-run: gh workflow run deploy-gitee-pages.yml --repo $GithubRepo'
Write-Host 'Preview login: Z-Float / 008AAA'
