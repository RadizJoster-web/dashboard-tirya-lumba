const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'tl_jwt';
const TIMEOUT_MS = 8000;

export function assetUrl(path?: string): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE.replace(/\/api\/?$/, '')}/${path.replace(/^\/+/, '')}`;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiPagination {
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

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = TIMEOUT_MS,
  allowRawResponse = false,
): Promise<T> {
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
  if (body.data !== undefined) return body.data;
  if (
    allowRawResponse &&
    typeof body === 'object' &&
    body !== null
  ) {
    return body as T;
  }
  if (init?.method !== 'DELETE') {
    throw new ApiError(body.message ?? `Permintaan gagal (${res.status}).`, res.status);
  }
  return undefined as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function apiGetPayload<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' }, TIMEOUT_MS, true);
}

export function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
