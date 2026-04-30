import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle, HelpCircle } from 'lucide-react';

// ============ CONTEXT ============

const ConfirmContext = createContext(null);

/**
 * useConfirm — globalny dialog potwierdzenia (zastępuje window.confirm).
 *
 * Powód: window.confirm pokazuje URL strony w nagłówku
 * ("raport-dnia-sporting.web.app says..."), co bywa mylące — np. user
 * usuwając notatkę myśli że usuwa raport dnia.
 *
 * Użycie:
 *   const confirm = useConfirm();
 *   const ok = await confirm({
 *     title: 'Usunąć zadanie?',
 *     message: 'Tej operacji nie można cofnąć.',
 *     confirmLabel: 'Usuń zadanie',
 *     danger: true,
 *   });
 *   if (!ok) return;
 *   // proceed with delete
 */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    // Fallback gdy Provider nie jest zamontowany — dla dev safety.
    return async (opts) => window.confirm(opts?.title || opts?.message || 'Potwierdzić?');
  }
  return ctx;
}

// ============ PROVIDER ============

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { title, message, confirmLabel, cancelLabel, danger, kind, resolve }
  const resolveRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({
        title: opts.title || 'Potwierdzić?',
        message: opts.message || '',
        confirmLabel: opts.confirmLabel || 'OK',
        cancelLabel: opts.cancelLabel || 'Anuluj',
        danger: !!opts.danger,
        kind: opts.kind || (opts.danger ? 'danger' : 'info'),
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
    setDialog(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
    setDialog(null);
  }, []);

  // Esc = cancel, Enter = confirm
  useEffect(() => {
    if (!dialog) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); handleCancel(); }
      else if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, handleCancel, handleConfirm]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            style={{
              maxWidth: 440, width: '100%',
              background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: '20px 22px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'confirmFadeIn 0.15s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: dialog.danger ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {dialog.danger ? (
                  dialog.kind === 'danger' ? <Trash2 size={18} style={{ color: '#f87171' }} /> : <AlertTriangle size={18} style={{ color: '#f87171' }} />
                ) : (
                  <HelpCircle size={18} style={{ color: '#a5b4fc' }} />
                )}
              </div>
              <h3 id="confirm-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
                {dialog.title}
              </h3>
            </div>
            {dialog.message && (
              <p style={{ margin: '0 0 18px 50px', fontSize: '0.88rem', lineHeight: 1.5, color: '#cbd5e1' }}>
                {dialog.message}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '9px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                  fontFamily: 'inherit',
                }}
                autoFocus={!dialog.danger}
              >
                {dialog.cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                autoFocus={dialog.danger}
                style={{
                  padding: '9px 18px', borderRadius: 8,
                  background: dialog.danger ? 'rgba(239,68,68,0.18)' : 'rgba(99,102,241,0.18)',
                  border: `1px solid ${dialog.danger ? 'rgba(239,68,68,0.45)' : 'rgba(99,102,241,0.45)'}`,
                  color: dialog.danger ? '#fca5a5' : '#a5b4fc',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700,
                  fontFamily: 'inherit',
                }}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
          <style>{`
            @keyframes confirmFadeIn {
              from { opacity: 0; transform: scale(0.97); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export default ConfirmProvider;
