// Rejestr 12 aplikacji ekosystemu Sporting
// Zródło: Claude Design mockup v1.1, 2026-05-08
// Każda apka ma: id, name, color (dominant), accent (jaśniejszy odcień dla VM/akcentów na jasnym tle), icon (Lucide), tagline, url, short

export const APPS = [
  {
    id: 'mycoach',
    name: 'MyCoach',
    color: '#7c3aed',
    accent: '#7c3aed',
    icon: 'Brain',
    tagline: 'Twój asystent CEO',
    short: 'Asystent CEO oparty o AI',
    url: 'https://raport-dnia-sporting.web.app/',
  },
  {
    id: 'cockpit',
    name: 'Sporting Cockpit',
    color: '#10b981',
    accent: '#10b981',
    icon: 'Crosshair',
    tagline: 'Centrum dowodzenia',
    short: 'KPI i wyniki w czasie rzeczywistym',
    url: 'https://cockpit-sporting.web.app/',
  },
  {
    id: 'marketing',
    name: 'Marketing Sporting',
    color: '#f97316',
    accent: '#f97316',
    icon: 'Megaphone',
    tagline: 'Karoliny biuro marketingu',
    short: 'Kampanie, kalendarz, treści',
    url: 'https://marketing-sporting.web.app/',
  },
  {
    id: 'hub',
    name: 'Hub Sporting',
    color: '#3b82f6',
    accent: '#3b82f6',
    icon: 'LayoutGrid',
    tagline: 'Launcher ekosystemu',
    short: 'Brama do całego ekosystemu',
    url: 'https://hub-sporting.web.app/',
  },
  {
    id: 'vm',
    name: 'VM Sporting',
    // Dwa odcienie — żółty miodowy:
    // color = na ciemnym tle (App Header z białymi literami)
    // accent = ciemniejszy, na jasnym tle (ikony rail, akcenty), WCAG AA
    color: '#eab308',
    accent: '#ca8a04',
    icon: 'Eye',
    tagline: 'Cichy sprzedawca',
    short: 'Visual merchandising sklepu',
    url: 'https://vm-sporting.web.app/',
  },
  {
    id: 'plakat',
    name: 'Plakat Studio',
    color: '#ec4899',
    accent: '#ec4899',
    icon: 'Palette',
    tagline: 'Kreacja Karoliny',
    short: 'Studio plakatów i kreacji POS',
    url: 'https://plakat-studio-sporting.web.app/',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    color: '#ef4444',
    accent: '#ef4444',
    icon: 'Activity',
    tagline: 'Puls firmy',
    short: 'Live feed wydarzeń i alertów',
    url: 'https://cockpit-sporting.web.app/pulse',
  },
  {
    id: 'reklamacje',
    name: 'Reklamacje',
    color: '#f59e0b',
    accent: '#f59e0b',
    icon: 'AlertCircle',
    tagline: '14 dni do rozwiązania',
    short: 'Obsługa reklamacji klientów',
    url: 'https://reklamacje-sporting.web.app/',
  },
  {
    id: 'procesy',
    name: 'Procesy Sporting',
    color: '#1e40af',
    accent: '#1e40af',
    icon: 'GitBranch',
    tagline: '99 procesów firmy',
    short: 'Drzewo procesów i procedur',
    url: 'https://zp.processapp.pl/dashboard',
  },
  {
    id: 'procedury',
    name: 'Procedury',
    color: '#22c55e',
    accent: '#16a34a',
    icon: 'FileText',
    tagline: 'Jak to zrobić? Zapytaj',
    short: 'Procedury i standardy + bot wyszukujący',
    url: 'https://wiedza-sporting.web.app/',
  },
  {
    id: 'lingua',
    name: 'LinguaAI',
    color: '#06b6d4',
    accent: '#06b6d4',
    icon: 'MessageCircle',
    tagline: 'Włoski na codzień',
    short: 'Nauka włoskiego z AI',
    url: 'https://linguaai-sporting.web.app/',
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    color: '#6366f1',
    accent: '#6366f1',
    icon: 'Footprints',
    tagline: 'Pierwsze 90 dni',
    short: 'Ścieżka nowego pracownika',
    url: 'https://sporting-onboarding-app.web.app/',
  },
  {
    id: 'grafik',
    name: 'Grafik Sporting',
    color: '#3730a3',
    accent: '#3730a3',
    icon: 'Calendar',
    tagline: 'Sandry harmonogram',
    short: 'Tygodniowy grafik zespołu',
    url: 'https://grafik-sporting.web.app/',
  },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));

/**
 * Helper: zwraca aktualną apkę na podstawie window.location.hostname
 * Użyj w SportingBar żeby wykryć w której apce jesteśmy
 */
export function detectCurrentApp() {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  for (const a of APPS) {
    if (!a.url) continue;
    try {
      const appHost = new URL(a.url).hostname;
      if (host === appHost) return a;
    } catch {}
  }
  return null;
}
