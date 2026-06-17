# 🤖 Automat: Claude na PC zawsze zna pomysły z `IDEAS.md`

Ten automat sprawia, że przy **każdym** uruchomieniu Claude Code na komputerze
(w aplikacji Claude lub w VS Code), **w dowolnym projekcie**, Claude:

1. ściąga najnowszą wersję `IDEAS.md` z GitHuba (`git pull`),
2. wczytuje jej treść do swojej pamięci.

Czyli: dopisujesz pomysł raz (np. w sesji na telefonie/webie), a Claude na PC
od razu go zna — **bez kopiowania, bez pisania „przeczytaj IDEAS.md"**.

## Jak to działa (technicznie)
To globalny **hook `SessionStart`** zapisany w `~/.claude/settings.json`.
Hook działa we wszystkich projektach (konfiguracja użytkownika, nie pojedynczego repo).

## Instalacja — RAZ na każdym komputerze

Najpierw miej sklonowane repo `sporting-shared` na dysku, wejdź do jego folderu, potem:

### Windows (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File scripts\setup-ideas-inbox.ps1
```

### macOS / Linux / WSL / Git Bash
```bash
bash scripts/setup-ideas-inbox.sh
```

Po instalacji otwórz **nową** sesję Claude Code — pomysły wczytają się same.

## Co robi instalator
- Tworzy skrypt hooka w `~/.claude/hooks/ideas-inbox.*` (ze ścieżką do Twojego klona repo).
- Dodaje wpis `SessionStart` do `~/.claude/settings.json` (robi kopię zapasową `.bak`).
- Instalacja jest idempotentna — można uruchomić ponownie bez duplikatów.

## Odinstalowanie
Usuń wpis `SessionStart` wskazujący na `ideas-inbox` z `~/.claude/settings.json`
(lub przywróć kopię `~/.claude/settings.json.bak`).

## Uwaga o telefonie (Fold 6) i sesjach webowych
Hooki lokalne działają na PC. Dla sesji uruchamianych „w chmurze" (web/telefon)
ten sam efekt daje hook `SessionStart` w `.claude/settings.json` **w danym repo** —
poproś Claude, żeby go dodał w wybranych repozytoriach, jeśli chcesz.
