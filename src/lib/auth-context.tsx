import { createContext, useContext, useState, type ReactNode } from 'react';
import { restoreSession, type SessionUser } from './auth';

const AuthContext = createContext<{ user: SessionUser | null; setUser: (user: SessionUser | null) => void } | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => restoreSession());

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
