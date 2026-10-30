import { invalidateResource } from './cache';
import { getToken, setToken, clearToken } from './token';

export { getToken, setToken, clearToken };

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000/api';
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

  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'no-cache');
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
  if (allowRawResponse && typeof body === 'object' && body !== null) {
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

export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<T> {
  const result = await apiRequest<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  invalidateResource();
  return result;
}
