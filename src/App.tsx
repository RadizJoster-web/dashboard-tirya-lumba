import { useCallback, useEffect, useState } from 'react';
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

  if (!user) {
    return (
      <Login
        onSuccess={(u) => {
          setUser(u);
          navigate('/');
        }}
      />
    );
  }

  const allowed = ROLE_PATHS[user.role].includes(path);
  const activePath = allowed ? path : '/';

  return (
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
  );
}
