const TOKEN_KEY = 'tl_jwt';

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
