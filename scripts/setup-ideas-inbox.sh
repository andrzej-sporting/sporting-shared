#!/usr/bin/env bash
# =====================================================================
#  Automat "Inbox pomysłów" dla Claude Code (macOS / Linux / WSL / Git Bash)
# ---------------------------------------------------------------------
#  Co robi: instaluje GLOBALNY hook SessionStart, który przy KAŻDYM
#  starcie Claude Code (w dowolnym projekcie) automatycznie:
#    1. odświeża IDEAS.md z GitHuba (git pull),
#    2. wczytuje jego treść do kontekstu Claude.
#
#  Uruchom RAZ, z wnętrza sklonowanego repo sporting-shared:
#      bash scripts/setup-ideas-inbox.sh
# =====================================================================
set -euo pipefail

# 1. Ustal ścieżkę do repo sporting-shared (root tego klona)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || echo "")"
[ -z "$REPO_DIR" ] && REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
if [ ! -f "$REPO_DIR/IDEAS.md" ]; then
  echo "BŁĄD: uruchom skrypt z wnętrza sklonowanego repo sporting-shared (brak IDEAS.md)." >&2
  exit 1
fi

CLAUDE_DIR="$HOME/.claude"
HOOK_DIR="$CLAUDE_DIR/hooks"
HOOK_SCRIPT="$HOOK_DIR/ideas-inbox.sh"
SETTINGS="$CLAUDE_DIR/settings.json"
mkdir -p "$HOOK_DIR"

# 2. Wygeneruj skrypt hooka (ze ścieżką do repo zapisaną na stałe)
cat > "$HOOK_SCRIPT" <<EOF
#!/usr/bin/env bash
# Auto-generowany przez setup-ideas-inbox.sh — wczytuje IDEAS.md do kontekstu.
REPO_DIR="$REPO_DIR"
git -C "\$REPO_DIR" pull --quiet --ff-only >/dev/null 2>&1 || true
echo "# Inbox pomysłów (IDEAS.md z sporting-shared) — wczytany automatycznie."
echo "# Gdy Andrzej poda nowy pomysł: dopisz go do \$REPO_DIR/IDEAS.md i zrób commit + push."
echo
cat "\$REPO_DIR/IDEAS.md" 2>/dev/null || echo "(Nie znaleziono IDEAS.md w \$REPO_DIR)"
EOF
chmod +x "$HOOK_SCRIPT"

# 3. Wpisz hook do globalnego ~/.claude/settings.json
if command -v jq >/dev/null 2>&1; then
  [ -f "$SETTINGS" ] && [ -s "$SETTINGS" ] || echo '{}' > "$SETTINGS"
  [ -f "$SETTINGS" ] && cp "$SETTINGS" "$SETTINGS.bak"
  tmp="$(mktemp)"
  jq --arg cmd "$HOOK_SCRIPT" '
    .hooks //= {} |
    .hooks.SessionStart //= [] |
    .hooks.SessionStart |= map(select(
      (.hooks // [] | map(.command // "") | any(contains("ideas-inbox"))) | not
    )) |
    .hooks.SessionStart += [{
      matcher: "startup|resume|clear",
      hooks: [{ type: "command", command: $cmd, timeout: 15 }]
    }]
  ' "$SETTINGS" > "$tmp" && mv "$tmp" "$SETTINGS"
  echo "✅ Hook globalny zainstalowany w $SETTINGS (kopia: $SETTINGS.bak)"
else
  echo "⚠️  Brak 'jq'. Dodaj ręcznie do $SETTINGS w sekcji \"hooks\":"
  cat <<MANUAL
  "SessionStart": [
    { "matcher": "startup|resume|clear",
      "hooks": [ { "type": "command", "command": "$HOOK_SCRIPT", "timeout": 15 } ] }
  ]
MANUAL
fi

echo ""
echo "GOTOWE. Repo pomysłów: $REPO_DIR"
echo "Otwórz nową sesję Claude Code w DOWOLNYM projekcie — pomysły wczytają się same."
