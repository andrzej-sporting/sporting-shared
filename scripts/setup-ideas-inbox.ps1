# =====================================================================
#  Automat "Inbox pomyslow" dla Claude Code (Windows / PowerShell)
# ---------------------------------------------------------------------
#  Co robi: instaluje GLOBALNY hook SessionStart, ktory przy KAZDYM
#  starcie Claude Code (w dowolnym projekcie) automatycznie:
#    1. odswieza IDEAS.md z GitHuba (git pull),
#    2. wczytuje jego tresc do kontekstu Claude.
#  Dzieki temu Claude zawsze zna aktualne pomysly - bez pisania.
#
#  Uruchom RAZ, z wnetrza sklonowanego repo sporting-shared:
#      powershell -ExecutionPolicy Bypass -File scripts\setup-ideas-inbox.ps1
# =====================================================================

$ErrorActionPreference = "Stop"

# 1. Ustal sciezke do repo sporting-shared (root tego klona)
try { $repo = (git rev-parse --show-toplevel 2>$null) } catch { $repo = $null }
if (-not $repo) { $repo = Split-Path -Parent $PSScriptRoot }
$repo = ($repo | Out-String).Trim()
if (-not (Test-Path (Join-Path $repo "IDEAS.md"))) {
    Write-Host "BLAD: uruchom skrypt z wnetrza sklonowanego repo sporting-shared (nie znaleziono IDEAS.md)." -ForegroundColor Red
    exit 1
}

$claudeDir  = Join-Path $env:USERPROFILE ".claude"
$hookDir    = Join-Path $claudeDir "hooks"
$hookScript = Join-Path $hookDir "ideas-inbox.ps1"
$settings   = Join-Path $claudeDir "settings.json"
New-Item -ItemType Directory -Force -Path $hookDir | Out-Null

# 2. Wygeneruj skrypt hooka (ze sciezka do repo zapisana na stale)
$hookBody = @"
# Auto-generowany przez setup-ideas-inbox.ps1 - wczytuje IDEAS.md do kontekstu.
`$repo = "$repo"
try { git -C "`$repo" pull --quiet --ff-only 2>`$null | Out-Null } catch {}
Write-Output "# Inbox pomyslow (IDEAS.md z sporting-shared) - wczytany automatycznie."
Write-Output "# Gdy Andrzej poda nowy pomysl: dopisz go do `$repo\IDEAS.md i zrob commit + push."
Write-Output ""
`$f = Join-Path "`$repo" "IDEAS.md"
if (Test-Path `$f) { Get-Content `$f -Raw } else { Write-Output "(Nie znaleziono IDEAS.md w `$repo)" }
"@
Set-Content -Path $hookScript -Value $hookBody -Encoding UTF8

# 3. Wpisz hook do globalnego ~/.claude/settings.json
$cmd = "powershell -NoProfile -ExecutionPolicy Bypass -File `"$hookScript`""

function Get-Prop($o, $name, $default) {
    if ($o -and ($o.PSObject.Properties.Name -contains $name)) { return $o.$name } else { return $default }
}

if (Test-Path $settings) {
    $raw = Get-Content $settings -Raw
    if ($raw.Trim()) { $obj = $raw | ConvertFrom-Json } else { $obj = [PSCustomObject]@{} }
    Copy-Item $settings "$settings.bak" -Force
    Write-Host "Kopia zapasowa: $settings.bak"
} else {
    $obj = [PSCustomObject]@{}
}

$hooks = Get-Prop $obj 'hooks' ([PSCustomObject]@{})
$sessionStart = @(Get-Prop $hooks 'SessionStart' @())

# Idempotentnosc: usun poprzedni wpis tego samego hooka
$sessionStart = @($sessionStart | Where-Object {
    $cmds = @($_.hooks | ForEach-Object { $_.command })
    -not ($cmds -match 'ideas-inbox')
})

$sessionStart += [PSCustomObject]@{
    matcher = "startup|resume|clear"
    hooks   = @([PSCustomObject]@{ type = "command"; command = $cmd; timeout = 15 })
}

if ($hooks.PSObject.Properties.Name -contains 'SessionStart') { $hooks.SessionStart = $sessionStart }
else { $hooks | Add-Member -NotePropertyName SessionStart -NotePropertyValue $sessionStart }

if ($obj.PSObject.Properties.Name -contains 'hooks') { $obj.hooks = $hooks }
else { $obj | Add-Member -NotePropertyName hooks -NotePropertyValue $hooks }

$obj | ConvertTo-Json -Depth 20 | Set-Content -Path $settings -Encoding UTF8

Write-Host ""
Write-Host "GOTOWE." -ForegroundColor Green
Write-Host "Hook globalny zainstalowany w: $settings"
Write-Host "Skrypt hooka: $hookScript"
Write-Host "Repo pomyslow: $repo"
Write-Host "Otworz nowa sesje Claude Code w DOWOLNYM projekcie - pomysly wczytaja sie same."
