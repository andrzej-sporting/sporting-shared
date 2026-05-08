// Sporting Design System — design tokens
// Zródło: mockup Claude Design v1.1, 2026-05-08

/**
 * Skala szarości (slate)
 * Tło aplikacji = gray.50 (jasne) lub gray.900 (ciemne)
 */
export const gray = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

/**
 * Stany systemu
 */
export const semantic = {
  success: '#10b981',
  warning: '#f59e0b',
  alert: '#ef4444',
  info: '#3b82f6',
};

/**
 * Sporting Bar (winieta) — kolor granatu, identyczny we wszystkich apkach
 */
export const sportingBar = {
  bg: '#0a1628',
  text: '#ffffff',
  textMuted: '#94a3b8',
  hover: 'rgba(255,255,255,0.10)',
  active: 'rgba(255,255,255,0.15)',
  height: 48, // px
};

/**
 * Skala typograficzna (Inter)
 */
export const fontSize = {
  caption: 12,
  small: 14,
  body: 16,
  h3: 20,
  h2: 24,
  h1: 32,
  display: 48,
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const fontFamily = {
  sans: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

/**
 * Skala radius (border-radius)
 */
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

/**
 * Skala spacing (4px-grid)
 */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

/**
 * Cienie
 */
export const shadow = {
  sm: '0 1px 2px 0 rgba(15,23,42,0.05)',
  md: '0 4px 6px -1px rgba(15,23,42,0.10), 0 2px 4px -2px rgba(15,23,42,0.06)',
  lg: '0 10px 15px -3px rgba(15,23,42,0.10), 0 4px 6px -4px rgba(15,23,42,0.05)',
  hover: '0 8px 20px -8px rgba(15,23,42,0.18)',
};
