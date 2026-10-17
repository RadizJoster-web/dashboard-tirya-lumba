import { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import Shell from './components/Shell';
import Login from './pages/Login';
import { ROLE_PATHS, restoreSession } from './lib/auth';
import type { SessionUser } from './lib/auth';

function pathFromHash(): string {
  const p = window.location.hash.slice(1) || '/';
  return p.startsWith('/') ? p : '/';
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(() => restoreSession());
  const [path, setPath] = useState<string>(() => pathFromHash());

  useEffect(() => {
    const onHash = () => setPath(pathFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((p: string) => {
    window.location.hash = p;
    setPath(p);
  }, []);

  const allowed = user ? ROLE_PATHS[user.role].includes(path) : false;
  const activePath = allowed ? path : '/';

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1d3557',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(29, 53, 87, 0.12)',
          },
        }}
      />
      {!user ? (
        <Login
          onSuccess={(u) => {
            setUser(u);
            navigate('/');
          }}
        />
      ) : (
        <Shell
          user={user}
          activePath={activePath}
          onNavigate={navigate}
          onLogout={() => {
            setUser(null);
            window.location.hash = '/';
            setPath('/');
          }}
        />
      )}
    </>
  );
}
