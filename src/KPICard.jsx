/**
 * KPI Card — kafelek z liczbą + label + trend + hint.
 *
 * Props:
 *  - label: string (np. "Konwersja GLS")
 *  - value: string (np. "13%")
 *  - delta?: string (np. "+0.8 pp" lub "-3%")
 *  - hint?: string (np. "Cel: 12% · powyżej")
 *  - accent?: string (kolor do podkreślenia value, default = gray.900)
 *  - icon?: ReactNode (Lucide)
 *  - onClick?: () => void
 */
export function KPICard({ label, value, delta, hint, accent = '#0f172a', icon, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16,
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        fontFamily: "'Inter', system-ui, sans-serif",
        display: 'block',
        width: '100%',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
      }}
      onMouseEnter={
        onClick
          ? (e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(15,23,42,0.18)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          : undefined
      }
      onMouseLeave={
        onClick
          ? (e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'none';
            }
          : undefined
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
        {icon && <div style={{ color: '#94a3b8', flexShrink: 0 }}>{icon}</div>}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1.1,
          color: accent,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {(delta || hint) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            marginTop: 8,
            flexWrap: 'wrap',
          }}
        >
          {delta && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: delta.startsWith('-') ? '#ef4444' : '#10b981',
              }}
            >
              {delta}
            </span>
          )}
          {hint && (
            <span style={{ fontSize: 11.5, color: '#64748b' }}>{hint}</span>
          )}
        </div>
      )}
    </Tag>
  );
}
