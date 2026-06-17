#!/bin/bash
# =====================================================================
#  Hook SessionStart (sesje "w chmurze": Claude Code na web / telefonie)
# ---------------------------------------------------------------------
#  Przy starcie sesji wczytuje treść IDEAS.md do kontekstu Claude,
#  żeby od razu znał aktualne pomysły — bez ręcznego pisania.
#
#  Uwaga: na komputerze (lokalnie) działa hook GLOBALNY z ~/.claude.
#  Tu celowo ograniczamy się do środowiska zdalnego, żeby na PC
#  pomysły nie wczytywały się dwa razy.
# =====================================================================
set -euo pipefail

# Działaj tylko w sesjach zdalnych (web/telefon). Lokalnie obsługuje to hook globalny.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

# Spróbuj odświeżyć IDEAS.md; jeśli się nie uda (brak sieci/uprawnień) — użyj wersji z klona.
git -C "$REPO" pull --quiet --ff-only >/dev/null 2>&1 || true

echo "# 💡 Inbox pomysłów (IDEAS.md) — wczytany automatycznie na starcie sesji."
echo "# Gdy Andrzej poda nowy pomysł: dopisz go do IDEAS.md i zrób commit + push."
echo
cat "$REPO/IDEAS.md" 2>/dev/null || echo "(Nie znaleziono IDEAS.md w $REPO)"
