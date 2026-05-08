import { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Bell, ChevronRight } from 'lucide-react';
import { APPS, APP_BY_ID } from './apps.js';
import { sportingBar } from './tokens.js';

/**
 * Sporting Bar — winieta granat, identyczna we wszystkich apkach ekosystemu.
 *
 * Props:
 *  - currentAppId: string (np. 'mycoach', 'cockpit', 'vm') — apka w której jesteśmy
 *  - userName?: string — wyświetlana nazwa użytkownika (opcjonalne)
 *  - notificationsCount?: number — liczba powiadomień (badge na dzwonku)
 *  - onLogoClick?: () => void — kliknięcie w logo (zwykle nawigacja do Hub)
 *
 * UX: kliknięcie w logo lub nazwę = nawigacja do Hub Sporting (chyba że onLogoClick).
 * App Switcher po prawej rozwija galerię 12 apek.
 */
export function SportingBar({
  currentAppId,
  userName,
  notificationsCount = 0,
  onLogoClick,
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handleLogo = () => {
    if (onLogoClick) onLogoClick();
    else if (typeof window !== 'undefined') {
      window.location.href = APP_BY_ID.hub.url;
    }
  };

  const currentApp = APP_BY_ID[currentAppId];

  return (
    <header
      style={{
        height: sportingBar.height,
        background: sportingBar.bg,
        color: sportingBar.text,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        userSelect: 'none',
        position: 'relative',
        zIndex: 50,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <button
        onClick={handleLogo}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginRight: 24,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: '#ffffff',
            color: sportingBar.bg,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          S
        </span>
        <span style={{ fontWeight: 600, letterSpacing: '-0.01em', fontSize: 15 }}>
          Sporting
        </span>
      </button>

      {/* Breadcrumb */}
      <div
        style={{
          fontSize: 12,
          color: sportingBar.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>Ekosystem</span>
        <ChevronRight size={12} color="#64748b" />
        <span style={{ color: '#e2e8f0' }}>{currentApp?.name || 'App'}</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* App Switcher */}
        <div ref={switcherRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setSwitcherOpen((v) => !v)}
            title="App Switcher"
            style={{
              height: 32,
              width: 32,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: switcherOpen ? sportingBar.active : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#e2e8f0',
            }}
            onMouseEnter={(e) => {
              if (!switcherOpen) e.currentTarget.style.background = sportingBar.hover;
            }}
            onMouseLeave={(e) => {
              if (!switcherOpen) e.currentTarget.style.background = 'transparent';
            }}
          >
            <LayoutGrid size={16} />
          </button>
          {switcherOpen && <AppSwitcherDropdown currentAppId={currentAppId} />}
        </div>

        {/* Bell */}
        <button
          title="Powiadomienia"
          style={{
            height: 32,
            width: 32,
            borderRadius: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#e2e8f0',
            position: 'relative',
            display: 'grid',
            placeItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = sportingBar.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={16} />
          {notificationsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 14,
                height: 14,
                padding: '0 4px',
                borderRadius: 999,
                background: '#ef4444',
                color: '#ffffff',
                fontSize: 9,
                fontWeight: 600,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </span>
          )}
        </button>

        {/* User badge (optional) */}
        {userName && (
          <div
            style={{
              marginLeft: 8,
              fontSize: 12,
              color: '#cbd5e1',
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            {userName}
          </div>
        )}
      </div>
    </header>
  );
}

function AppSwitcherDropdown({ currentAppId }) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 40,
        width: 360,
        background: '#ffffff',
        color: '#0f172a',
        borderRadius: 12,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.30)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Ekosystem Sporting</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {APPS.length} aplikacji wewnętrznych
          </div>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: '#94a3b8',
          }}
        >
          v1.0
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          padding: 12,
        }}
      >
        {APPS.map((a) => (
          <a
            key={a.id}
            href={a.url}
            target={typeof window !== 'undefined' && window.location.hostname.includes(new URL(a.url).hostname) ? undefined : '_self'}
            style={{
              display: 'block',
              padding: 10,
              borderRadius: 8,
              border:
                a.id === currentAppId ? '1px solid #0f172a' : '1px solid transparent',
              background: 'rgba(248, 250, 252, 0.6)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px -8px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: a.color,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 8,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {a.name.charAt(0)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
              {a.name}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: '#64748b',
                lineHeight: 1.2,
                marginTop: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {a.short}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
