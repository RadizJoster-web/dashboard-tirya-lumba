export type Role = 'admin' | 'pengelola';

export interface SessionUser {
  username: string;
  role: Role;
  nama: string;
  lokasi?: string;
}

interface StoredUser {
  pw: string;
  role: Role;
  nama: string;
  lokasi?: string;
}

// Demo accounts mirrored from the HTML prototype.
const USERS: Record<string, StoredUser> = {
  admin: { pw: 'admin123', role: 'admin', nama: 'Admin Pusat' },
  pengelola: { pw: 'kolam123', role: 'pengelola', nama: 'Budi (Pengelola)', lokasi: 'Kolam Tirta Jaya' },
};

const TOKEN_KEY = 'tl_token';
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

interface TokenPayload {
  u: string;
  exp: number;
}

function storage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage;
}

export function login(username: string, password: string, remember: boolean): SessionUser | null {
  const key = username.trim().toLowerCase().split('@')[0];
  const found = USERS[key];
  if (!found || found.pw !== password) return null;
  const payload: TokenPayload = { u: key, exp: Date.now() + TOKEN_TTL };
  try {
    storage(remember).setItem(TOKEN_KEY, btoa(JSON.stringify(payload)));
  } catch {
    // storage unavailable (private mode), session still works in-memory
  }
  return toSession(key);
}

export function restoreSession(): SessionUser | null {
  for (const s of [localStorage, sessionStorage]) {
    try {
      const raw = s.getItem(TOKEN_KEY);
      if (!raw) continue;
      const payload = JSON.parse(atob(raw)) as TokenPayload;
      if (payload.exp > Date.now() && USERS[payload.u]) return toSession(payload.u);
    } catch {
      continue;
    }
  }
  return null;
}

export function logout(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function toSession(key: string): SessionUser {
  const { role, nama, lokasi } = USERS[key];
  return lokasi ? { username: key, role, nama, lokasi } : { username: key, role, nama };
}

export const NAV: { path: string; label: string }[] = [
  { path: '/', label: 'Overview' },
  { path: '/pendaftaran', label: 'Pendaftaran' },
  { path: '/jadwal', label: 'Jadwal & Sesi' },
  { path: '/lokasi', label: 'Lokasi' },
  { path: '/paket', label: 'Harga & Paket' },
  { path: '/absen', label: 'Absensi' },
  { path: '/siswa', label: 'Siswa' },
  { path: '/pelatih', label: 'Pelatih' },
  { path: '/pengelola', label: 'Pengelola' },
];

export const ROLE_PATHS: Record<Role, string[]> = {
  admin: NAV.map((n) => n.path),
  pengelola: ['/', '/pendaftaran', '/absen', '/siswa'],
};

export function pathsFor(role: Role): { path: string; label: string }[] {
  const allowed = new Set(ROLE_PATHS[role]);
  return NAV.filter((n) => allowed.has(n.path));
}
