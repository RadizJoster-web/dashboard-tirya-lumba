const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';

export function assetUrl(path?: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE.replace(/\/api\/?$/, '')}/${path.replace(/^\/+/, '')}`;
}
import type { RegisterInstructorPayload, RegisterResult, RegisterStudentPayload, UploadOutcome, ServerAbsen, AbsenPayload, AbsenResult, ServerSiswa, SiswaPayload, ServerPelatih, PelatihPayload, ServerPengelola, PengelolaPayload, ServerSesi, SesiPayload, ServerResched, ReschedPayload, ServerProfil } from './api-types';

const TOKEN_KEY = 'tl_jwt';
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: ApiPagination;
}

export function getToken(): string | null {
  for (const s of [localStorage, sessionStorage]) {
    try {
      const t = s.getItem(TOKEN_KEY);
      if (t) return t;
    } catch {
      // storage unavailable, keep looking
    }
  }
  return null;
}

export function setToken(token: string, remember: boolean): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // storage unavailable, request falls back to cookie-only auth
  }
}

export function clearToken(): void {
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

export async function apiRequest<T>(path: string, init?: RequestInit, timeoutMs: number = TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  const headers = new Headers(init?.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init?.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    window.clearTimeout(timer);
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiError(aborted ? 'Koneksi ke server timeout.' : 'Tidak dapat terhubung ke server.', 0);
  }
  window.clearTimeout(timer);

  let body: Envelope<T> | null;
  try {
    body = (await res.json()) as Envelope<T>;
  } catch {
    body = null;
  }

  if (!res.ok || !body || body.success === false) {
    throw new ApiError(body?.message ?? `Permintaan gagal (${res.status}).`, res.status);
  }
  if (body.data === undefined && init?.method !== 'DELETE') {
    throw new ApiError(body.message ?? `Permintaan gagal (${res.status}).`, res.status);
  }
  return body.data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** Multipart upload (foto/CV/bukti bayar). Response can be loose; see parseUploadOutcome. */
export function uploadFile(path: string, form: FormData): Promise<UploadOutcome> {
  return apiRequest<UploadOutcome>(path, { method: 'POST', body: form }, 30000);
}

/** Kirim formulir pendaftaran murid (POST /register/student). */
export function registerStudent(payload: RegisterStudentPayload): Promise<RegisterResult> {
  return apiSend<RegisterResult>('/register/student', 'POST', payload);
}

/** Kirim formulir pendaftaran pelatih + deklarasi jadwal (POST /register/instructor). */
export function registerInstructor(payload: RegisterInstructorPayload): Promise<RegisterResult> {
  return apiSend<RegisterResult>('/register/instructor', 'POST', payload);
}

/** Ambil riwayat absensi dari server (GET /absensi). */
export function apiGetAbsensi(path: string): Promise<ServerAbsen[]> {
  return apiGet<ServerAbsen[]>(path);
}

/** Simpan absensi hari ini ke server (POST /absensi). */
export function apiSendAbsensi(path: string, payload: AbsenPayload[]): Promise<AbsenResult> {
  return apiSend<AbsenResult>(path, 'POST', payload);
}

/** ---------- Siswa ---------- */
export function apiGetSiswa(): Promise<ServerSiswa[]> {
  return apiGet<ServerSiswa[]>('/siswa');
}

export function apiSendSiswa(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: Partial<SiswaPayload>): Promise<ServerSiswa> {
  return apiSend<ServerSiswa>(path, method, payload);
}

/** ---------- Pelatih ---------- */
export function apiGetPelatih(): Promise<ServerPelatih[]> {
  return apiGet<ServerPelatih[]>('/pelatih');
}

export function apiSendPelatih(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: PelatihPayload): Promise<ServerPelatih> {
  return apiSend<ServerPelatih>(path, method, payload);
}

/** ---------- Pengelola ---------- */
export function apiGetPengelola(): Promise<ServerPengelola[]> {
  return apiGet<ServerPengelola[]>('/pool-managers');
}

export function apiSendPengelola(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: PengelolaPayload): Promise<ServerPengelola> {
  return apiSend<ServerPengelola>(path, method, payload);
}

/** ---------- Jadwal / Sesi ---------- */
export function apiGetSesi(): Promise<ServerSesi[]> {
  return apiGet<ServerSesi[]>('/sessions');
}

export function apiSendSesi(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: SesiPayload): Promise<ServerSesi> {
  return apiSend<ServerSesi>(path, method, payload);
}

/** ---------- Reschedule ---------- */
export function apiGetResched(): Promise<ServerResched[]> {
  return apiGet<ServerResched[]>('/resched');
}

export function apiSendResched(path: string, method: 'POST' | 'PUT' | 'DELETE', payload?: ReschedPayload): Promise<ServerResched> {
  return apiSend<ServerResched>(path, method, payload);
}

/** ---------- Profil ---------- */
export function apiGetProfil(): Promise<ServerProfil> {
  return apiGet<ServerProfil>('/auth/me');
}
