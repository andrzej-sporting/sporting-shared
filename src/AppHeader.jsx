/**
 * App Header — pasek tożsamości apki, kolor dominujący apki, 64px.
 *
 * Props:
 *  - app: object z apps.js (np. APP_BY_ID.cockpit) — ZAWIERA color, name, tagline
 *  - icon: ReactNode — ikona Lucide jako element React (np. <Crosshair size={28} color="#fff" />)
 *  - rightSlot?: ReactNode — opcjonalny element po prawej (np. role switcher, akcje)
 */
export function AppHeader({ app, icon, rightSlot }) {
  if (!app) return null;
  return (
    <div
      style={{
        height: 64,
        background: app.color,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        {icon && (
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.15)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.015em',
              lineHeight: 1.1,
            }}
          >
            {app.name}
          </div>
          {app.tagline && (
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                marginTop: 2,
              }}
            >
              {app.tagline}
            </div>
          )}
        </div>
      </div>
      {rightSlot && (
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}
