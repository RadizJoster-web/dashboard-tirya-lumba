import { ApiError, apiSend, clearToken, getToken, setToken } from './api/client';
import { clearResources } from './api/cache';
import type { ServerLogin } from './api/types';

export type Role = 'admin' | 'pengelola';

export interface SessionUser {
  username: string;
  role: Role;
  nama: string;
  lokasi?: string;
  userId?: string;
  email?: string;
}

const USER_KEY = 'tl_user';

interface StoredSession {
  user: SessionUser;
  exp: number;
}

export type LoginOutcome = { ok: true; user: SessionUser } | { ok: false; message: string };

function storage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

function persist(user: SessionUser, exp: number, remember: boolean): void {
  try {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
    storage(remember).setItem(USER_KEY, JSON.stringify({ user, exp } satisfies StoredSession));
  } catch {
    // storage unavailable (private mode); the session still lives in React state
  }
}

function jwtExpiry(token: string): number {
  try {
    const part = token.split('.')[1];
    if (!part) return 0;
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const json = JSON.parse(atob(padded)) as { exp?: number };
    return (json.exp ?? 0) * 1000;
  } catch {
    return 0;
  }
}

function roleFromServer(role: string): Role {
  return role === 'POOL_MANAGER' ? 'pengelola' : 'admin';
}

export async function authenticate(idRaw: string, password: string, remember: boolean): Promise<LoginOutcome> {
  const email = idRaw.trim();
  if (!email.includes('@')) {
    return { ok: false, message: 'Masukkan email akun yang terdaftar di server.' };
  }

  try {
    const data = await apiSend<ServerLogin>('/auth/login', 'POST', { email, password });
    if (data.user.role !== 'ADMIN' && data.user.role !== 'POOL_MANAGER') {
      clearToken();
      return { ok: false, message: 'Akun ini tidak memiliki akses ke dashboard.' };
    }
    setToken(data.token, remember);
    const user: SessionUser = {
      username: data.user.email,
      role: roleFromServer(data.user.role),
      nama: (data.user as any).fullName || data.user.email,
      email: data.user.email,
      userId: data.user.userId,
      lokasi: (data.user as any).locationName || (data.user as any).lokasi || undefined,
    };
    persist(user, jwtExpiry(data.token), remember);
    return { ok: true, user };
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return { ok: false, message: err.message };
    }
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Tidak dapat terhubung ke server.',
    };
  }
}

export function restoreSession(): SessionUser | null {
  // Sessions from the removed demo login have no JWT; drop them instead of restoring access.
  if (!getToken()) return null;
  for (const s of [localStorage, sessionStorage]) {
    try {
      const raw = s.getItem(USER_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as StoredSession;
      if (parsed.exp > Date.now()) return parsed.user;
    } catch {
      continue;
    }
  }
  return null;
}

export function logout(): void {
  clearToken();
  clearResources();
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

export const NAV: { path: string; label: string }[] = [
  { path: '/overview', label: 'Overview' },
  { path: '/pendaftaran', label: 'Pendaftaran' },
  { path: '/jadwal', label: 'Jadwal & Sesi' },
  { path: '/lokasi', label: 'Lokasi' },
  { path: '/paket', label: 'Harga & Paket' },
  { path: '/absen', label: 'Absensi' },
  { path: '/siswa', label: 'Siswa' },
  { path: '/pelatih', label: 'Pelatih' },
  { path: '/pengelola', label: 'Pengelola' },
  { path: '/profil', label: 'Profil' },
];

export const ROLE_PATHS: Record<Role, string[]> = {
  admin: NAV.map((n) => n.path),
  pengelola: ['/overview', '/pendaftaran', '/siswa', '/pelatih', '/absen', '/profil'],
};

export function pathsFor(role: Role): { path: string; label: string }[] {
  const allowed = new Set(ROLE_PATHS[role]);
  return NAV.filter((n) => allowed.has(n.path));
}
