# @sporting/ui

Współdzielone komponenty UI dla ekosystemu aplikacji Sporting.

## Instalacja w apce

```bash
npm install github:andrzej-sporting/sporting-shared
```

## Użycie — ConfirmDialog

W `App.jsx` (root):

```jsx
import { ConfirmProvider } from '@sporting/ui';

function App() {
  return (
    <ConfirmProvider>
      {/* reszta aplikacji */}
    </ConfirmProvider>
  );
}
```

W komponencie który potrzebuje potwierdzenia:

```jsx
import { useConfirm } from '@sporting/ui';

function MyComponent() {
  const confirm = useConfirm();

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Usunąć ten element?',
      message: 'Tej operacji nie można cofnąć.',
      confirmLabel: 'Usuń',
      danger: true,
    });
    if (!ok) return;
    // proceed with delete
  };
}
```

## Dlaczego

`window.confirm()` w przeglądarce pokazuje URL strony w prefiksie ("nazwa-domeny.web.app says..."), co bywa mylące dla użytkowników (np. "raport-dnia-sporting" myślony jako "raport dnia"). Własny modal eliminuje ten problem i daje spójny wygląd we wszystkich apkach Sportingu.

## Komponenty
- `ConfirmDialog` (Provider + useConfirm hook) — globalny modal potwierdzenia
