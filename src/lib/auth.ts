import { ApiError, apiSend, clearToken, setToken } from './api';
import type { ServerLogin } from './api-types';

export type Role = 'admin' | 'pengelola';

export interface SessionUser {
  username: string;
  role: Role;
  nama: string;
  lokasi?: string;
  userId?: string;
  email?: string;
  source: 'server' | 'demo';
}

interface DemoUser {
  pw: string;
  role: Role;
  nama: string;
  lokasi?: string;
}

// Offline fallback accounts mirrored from the HTML prototype. Used when the backend is unreachable.
const DEMO_USERS: Record<string, DemoUser> = {
  admin: { pw: 'admin123', role: 'admin', nama: 'Admin Pusat' },
  pengelola: { pw: 'kolam123', role: 'pengelola', nama: 'Budi Santoso', lokasi: 'Kolam Tirta Jaya' },
};

const USER_KEY = 'tl_user';
const DEMO_TTL = 7 * 24 * 60 * 60 * 1000;

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

function loginDemo(key: string, password: string, remember: boolean): SessionUser | null {
  const found = DEMO_USERS[key];
  if (!found || found.pw !== password) return null;
  const user: SessionUser = {
    username: key,
    role: found.role,
    nama: found.nama,
    source: 'demo',
    ...(found.lokasi ? { lokasi: found.lokasi } : {}),
  };
  persist(user, Date.now() + DEMO_TTL, remember);
  return user;
}

// Try the server first for email logins, then fall back to demo accounts when it is offline.
export async function authenticate(idRaw: string, password: string, remember: boolean): Promise<LoginOutcome> {
  const id = idRaw.trim();
  const demoKey = id.toLowerCase().split('@')[0];

  if (id.includes('@')) {
    try {
      const data = await apiSend<ServerLogin>('/auth/login', 'POST', { email: id, password });
      if (data.user.role !== 'ADMIN' && data.user.role !== 'POOL_MANAGER') {
        clearToken();
        return { ok: false, message: 'Akun ini tidak memiliki akses ke dashboard.' };
      }
      setToken(data.token, remember);
      const user: SessionUser = {
        username: data.user.email,
        role: roleFromServer(data.user.role),
        nama: data.user.email,
        email: data.user.email,
        userId: data.user.userId,
        source: 'server',
      };
      persist(user, jwtExpiry(data.token), remember);
      return { ok: true, user };
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        return { ok: false, message: err.message };
      }
      // network or server error: fall through to demo accounts
    }
  }

  const demo = loginDemo(demoKey, password, remember);
  if (demo) return { ok: true, user: demo };
  return { ok: false, message: 'Email atau password yang Anda masukkan salah.' };
}

export function restoreSession(): SessionUser | null {
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
  pengelola: ['/overview', '/pendaftaran', '/absen', '/siswa', '/profil'],
};

export function pathsFor(role: Role): { path: string; label: string }[] {
  const allowed = new Set(ROLE_PATHS[role]);
  return NAV.filter((n) => allowed.has(n.path));
}
