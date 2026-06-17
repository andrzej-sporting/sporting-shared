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
- `🔨 W TRAKCIE` · 2026-06-17 · MyCoach · 🔒 PILNE / BEZPIECZEŃSTWO · W repo zaszyte na sztywno
  poświadczenia: hasło do SQL Server + API key do Cloud Functions (plik `scripts/subiekt-to-mycoach.cjs`,
  ~linie 20–37). Do zrobienia: (1) OBRÓCIĆ poświadczenia — nowe hasło SQL i nowy API key (stare = skompromitowane);
  (2) przenieść do zmiennych środowiskowych (`.env` + `.gitignore`, nie commitować); (3) rozważyć usunięcie z historii
  git (BFG / git filter-repo). Naprawa po stronie repo MyCoach (nie sporting-shared). [znalezione w analizie kodu]
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

## 🚀 Nowe projekty / inicjatywy (poza istniejącymi apkami)
<!-- Pomysły, które nie pasują do żadnej obecnej apki: nowe aplikacje,
     narzędzia wewnętrzne, automatyzacje, pomysły biznesowe, eksperymenty.
     Gdy taki pomysł dojrzeje i dostanie własne repo — dopisz je do mapy wyżej. -->

---
