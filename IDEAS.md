# 💡 Inbox pomysłów — ekosystem Sporting

> **Po co ten plik:** centralne miejsce, gdzie Andrzej na bieżąco wrzuca pomysły
> na wszystkie apki. Claude je tu zapisuje, a później wdraża do właściwego repo.
> To jest "pamięć" między sesjami — bez tego pliku pomysły giną wraz z kontenerem.

## 📜 Jak Claude ma z tego korzystać (konwencja)
- Nowy pomysł → dopisz na górze odpowiedniej sekcji apki ze statusem `💡 NOWY` i datą.
- Gdy zaczynasz wdrażać → zmień status na `🔨 W TRAKCIE`.
- Po wdrożeniu → status `✅ WDROŻONY`, dopisz repo + link do commita/PR.
- Odrzucony pomysł → `❌ ODRZUCONY` + krótkie uzasadnienie (nie kasuj, zostaw ślad).
- Po KAŻDEJ zmianie tego pliku: commit + push (inaczej pomysł przepadnie).
- Na starcie sesji: przeczytaj ten plik, żeby wiedzieć co nowe / w toku.

## 🏷️ Legenda statusów
`💡 NOWY` · `📋 ZAPLANOWANY` · `🔨 W TRAKCIE` · `✅ WDROŻONY` · `❌ ODRZUCONY`

## 📦 Mapa repozytoriów (gdzie wdrażać)
| Apka | Repo |
|---|---|
| MyCoach | `andrzej-sporting/MyCoach` |
| Sporting Cockpit | `andrzej-sporting/CockpitSporting` |
| Hub Sporting | `andrzej-sporting/hub-sporting` |
| Marketing | `andrzej-sporting/marketing-sporting` |
| VM Sporting | `andrzej-sporting/vm-sporting` |
| Plakat Studio | `andrzej-sporting/PlakatStudio` |
| Reklamacje | `andrzej-sporting/reklamacje-sporting` |
| Procesy | `andrzej-sporting/Procesy` |
| LinguaAI | `andrzej-sporting/LinguaAI` |
| Onboarding | `andrzej-sporting/sporting-onboarding` |
| Grafik | `andrzej-sporting/GrafikSporting` |
| Wspólne UI | `andrzej-sporting/sporting-shared` |

---

## 🧠 MyCoach
<!-- pomysły dot. MyCoach -->
- `🔨 W TRAKCIE` · 2026-06-17 · MyCoach · 🔒 PILNE / BEZPIECZEŃSTWO · Zaszyte na sztywno poświadczenia w kodzie.
  POSTĘP (sesja PC): kod oczyszczony — wszystkie sekrety przeniesione do `.env` przez wspólny `scripts/secrets.cjs`
  (znaleziono więcej niż zakładano: hasło SQL w 7 plikach, API key w 6, + hasło FTP i 2 inne); dodany `.env.example`
  + `.gitignore`; PR #2 w repo MyCoach (czeka na scalenie). Czyszczenie historii git: świadomie ODPUSZCZONE
  (stawiamy na rotację). POZOSTAJE — KRYTYCZNE: rotacja po stronie Kuby (Jakub Kurpisz) — zmiana hasła SQL na bazie
  + wymiana klucza API + przepięcie `functions/index.js` na Secret Manager (~15 min, jeden ruch). Zlecone na bus
  Kuby + ping Bitrix (msg 127061). Repo MyCoach jest prywatne (wyciek ograniczony). Przypomnieć ~20.06.
- `🔨 W TRAKCIE` · 2026-06-17 · MyCoach · Dostęp Claude do danych z apki — Krok 1 ZROBIONY (analiza kodu):
  dane operacyjne w Google Firestore (NoSQL, projekt `raport-dnia-sporting`, ~130 kolekcji: reports, tasks,
  projects, kpiData, coaching, HR/grafik…), pliki w Firebase Storage, logika w Cloud Functions; SQL Server
  (Subiekt GT) to TYLKO feed → Firestore (jednokierunkowo). Krok 2 (rekomendacja): czytać przez konto serwisowe
  Firebase TYLKO-DO-ODCZYTU albo zaplanowany eksport kolekcji do JSON. Uwaga RODO — dane pracowników/zawodników.

## 🎯 Cockpit
<!-- ... -->

## 📣 Marketing

## 🟦 Hub

## 👁️ VM Sporting

## 🎨 Plakat Studio

## 🟠 Reklamacje

## 🌿 Procesy

## 💬 LinguaAI

## 👣 Onboarding

## 📅 Grafik

## 🧩 Wspólne UI (sporting-shared)

## 🌐 Pomysły przekrojowe (kilka apek naraz)
- `🔨 W TRAKCIE` · 2026-06-17 · META / wszystkie apki · **Cel nadrzędny Andrzeja: praca z Claude Code w trybie
  ciągłym = JEDNA WSPÓLNA PAMIĘĆ** (jedno źródło prawdy) dla wszystkich sesji (web/PC/telefon) i wszystkich apek.
  To jest właściwy powód powstania IDEAS.md. Stan: mamy `IDEAS.md` + hooki auto-wczytujące (PC globalny + web w repo).
  RYZYKO: sesja PC prowadzi OSOBNY system pamięci (bus z zadaniami `zadanie-YYYY-MM-DD-temat.md` / `done-…`,
  „indeks pamięci", zasady numerowane np. 15.2, backupy, ping Bitrix przez `notify-bitrix.cjs`) — czyli są DWA mózgi.
  PLAN: (1) **[NEXT]** zmapować system pamięci PC do wspólnego miejsca; (2) wybrać jedno źródło prawdy;
  (3) wpiąć wszystko (hooki czytają i piszą tylko tam). Decyzja Andrzeja (2026-06-17): najpierw zmapować PC.

## 🚀 Nowe projekty / inicjatywy (poza istniejącymi apkami)
<!-- Pomysły, które nie pasują do żadnej obecnej apki: nowe aplikacje,
     narzędzia wewnętrzne, automatyzacje, pomysły biznesowe, eksperymenty.
     Gdy taki pomysł dojrzeje i dostanie własne repo — dopisz je do mapy wyżej. -->

---
