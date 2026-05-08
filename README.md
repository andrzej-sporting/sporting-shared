# @sporting/ui

Współdzielone komponenty UI dla **Design System Sporting** (ekosystem 12 aplikacji wewnętrznych).

## Instalacja w apce

```bash
npm install github:andrzej-sporting/sporting-shared
```

Wymaga: `react >=18`, `react-dom >=18`, `lucide-react`.

---

## Design System Sporting (v1.1, 2026-05-09)

### 3 warstwy każdej apki

```
┌────────────────────────────────────────────────┐
│ Sporting Bar (winieta granat #0a1628, 48px)    │  ← warstwa 1, IDENTYCZNA we wszystkich apkach
├────────────────────────────────────────────────┤
│ App Header (kolor apki, 64px, ikona + nazwa)   │  ← warstwa 2, KOLOR PER APKA
├────────────────────────────────────────────────┤
│                                                │
│ Layout (DNA apki — sidebar/grid/foto-first)    │  ← warstwa 3, DNA UNIKALNE
│                                                │
└────────────────────────────────────────────────┘
```

### Użycie — szkielet apki

```jsx
import { SportingBar, AppHeader, APP_BY_ID } from '@sporting/ui';
import { Crosshair } from 'lucide-react';

export default function MyApp() {
  const app = APP_BY_ID.cockpit; // ta apka

  return (
    <>
      <SportingBar
        currentAppId="cockpit"
        userName="Andrzej"
        notificationsCount={3}
      />
      <AppHeader
        app={app}
        icon={<Crosshair size={28} color="#fff" strokeWidth={2.25} />}
        rightSlot={<RoleSwitcher />}
      />
      <main>
        {/* layout główny apki */}
      </main>
    </>
  );
}
```

### KPI Card

```jsx
import { KPICard } from '@sporting/ui';
import { Percent } from 'lucide-react';

<KPICard
  label="Konwersja GLS"
  value="13%"
  delta="+0.8 pp"
  hint="Cel: 12% · powyżej"
  accent="#10b981"
  icon={<Percent size={14} />}
/>
```

---

## Paleta 12 apek

Pełna definicja w `src/apps.js`. Skrót:

| Apka | Kolor | Hex | Ikona |
|---|---|---|---|
| MyCoach | fioletowy | `#7c3aed` | Brain |
| Sporting Cockpit | zielony | `#10b981` | Crosshair |
| Marketing Sporting | pomarańczowy | `#f97316` | Megaphone |
| Hub Sporting | niebieski | `#3b82f6` | LayoutGrid |
| **VM Sporting** | **żółty miodowy** | `#eab308` (header) / `#ca8a04` (akcent jasny) | Eye |
| Plakat Studio | różowy | `#ec4899` | Palette |
| Pulse | czerwony | `#ef4444` | Activity |
| Reklamacje | bursztyn | `#f59e0b` | AlertCircle |
| Procesy Sporting | granatowy | `#1e40af` | GitBranch |
| LinguaAI | turkus | `#06b6d4` | MessageCircle |
| Onboarding | indygo | `#6366f1` | Footprints |
| Grafik Sporting | indygo ciemny | `#3730a3` | Calendar |

**VM Sporting używa dwóch odcieni żółtego** dla WCAG AA:
- `#eab308` — App Header (na żółtym tle białe litery, kontrast OK)
- `#ca8a04` — ikony rail + akcenty na białym/jasnym tle (kontrast 4.7:1, AA)

---

## Tokens

```js
import { tokens } from '@sporting/ui';

tokens.gray[500];      // #64748b
tokens.semantic.alert; // #ef4444
tokens.fontSize.h1;    // 32 (px)
tokens.radius.lg;      // 12 (px)
tokens.shadow.hover;   // gotowy box-shadow
```

---

## ConfirmDialog (v1.0, legacy)

```jsx
import { ConfirmProvider, useConfirm } from '@sporting/ui';

// W root:
<ConfirmProvider>{/* app */}</ConfirmProvider>

// W komponencie:
const confirm = useConfirm();
const ok = await confirm({ title: 'Usunąć?', danger: true });
```

Cel: zastąpić `window.confirm()` żeby uniknąć "raport-dnia-sporting.web.app says..." w przeglądarce.

---

## Zródło Design System

Mockup źródłowy: Claude Design (claude.ai/design), 2026-05-08, projekt "Sporting Design System". Live podgląd HTML: [hub-sporting.web.app](https://hub-sporting.web.app) → przycisk **🎨 Design** (CEO-only).

Pełna dokumentacja decyzji: `memory/project_design_system_sporting.md`.

## Komponenty

| Komponent | Plik | Status |
|---|---|---|
| `SportingBar` | `src/SportingBar.jsx` | v1.1 LIVE |
| `AppHeader` | `src/AppHeader.jsx` | v1.1 LIVE |
| `KPICard` | `src/KPICard.jsx` | v1.1 LIVE |
| `APPS, APP_BY_ID, detectCurrentApp` | `src/apps.js` | v1.1 LIVE |
| `tokens` | `src/tokens.js` | v1.1 LIVE |
| `ConfirmProvider, useConfirm` | `src/ConfirmDialog.jsx` | v1.0 LIVE |

## Roadmap v1.2

- `MobileSportingBar` — uproszczona winieta 44px dla telefonu
- `MobileBottomNav` — bottom nav 5 ikon dla mobile
- `DataTable` — wspólna tabela
- `EmptyState` — stan pusty z ilustracją + CTA
