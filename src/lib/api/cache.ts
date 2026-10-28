import { useCallback, useEffect, useSyncExternalStore } from 'react';

export interface ResourceState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  loaded: boolean;
}

const idle: ResourceState<unknown> = {
  data: null,
  error: null,
  loading: false,
  loaded: false,
};

const states = new Map<string, ResourceState<unknown>>();
const fetchers = new Map<string, () => Promise<unknown>>();
const pending = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<() => void>>();

function stateOf(key: string): ResourceState<unknown> {
  return states.get(key) ?? idle;
}

function setState(key: string, next: ResourceState<unknown>): void {
  states.set(key, next);
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribeTo(key: string, listener: () => void): () => void {
  let group = listeners.get(key);
  if (!group) {
    group = new Set();
    listeners.set(key, group);
  }
  group.add(listener);
  return () => {
    group.delete(listener);
    if (group.size === 0) listeners.delete(key);
  };
}

/**
 * Memuat resource dari network request.
 * Mendukung in-flight request deduplication tanpa memblokir refetch jaringan.
 */
export function loadResource<T>(
  key: string,
  fetcher?: () => Promise<T>,
  force = false,
): Promise<T> {
  if (fetcher) fetchers.set(key, fetcher);

  const current = states.get(key) as ResourceState<T> | undefined;

  // Jika tidak dipaksa dan sedang ada request berjalan, gunakan promise yang sama
  if (!force) {
    const running = pending.get(key);
    if (running) return running as Promise<T>;
  }

  const run = fetchers.get(key);
  if (!run) {
    return Promise.reject(new Error(`Resource "${key}" belum memiliki fetcher.`));
  }

  // Tampilkan data yang sudah ada (jika ada) sambil loading di background
  setState(key, {
    data: current?.data ?? null,
    error: null,
    loading: true,
    loaded: Boolean(current?.loaded),
  });

  const request = run()
    .then((data) => {
      setState(key, { data, error: null, loading: false, loaded: true });
      return data;
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Gagal memuat data dari server.';
      setState(key, {
        data: current?.data ?? null,
        error: message,
        loading: false,
        loaded: true,
      });
      throw error;
    })
    .finally(() => {
      pending.delete(key);
    });

  pending.set(key, request);
  return request as Promise<T>;
}

/**
 * Invalidation otomatis: Menghapus cache resource dan memicu refetch ke server.
 * Jika keyOrPrefix diberikan, hanya resource yang cocok yang di-invalidate.
 */
export function invalidateResource(keyOrPrefix?: string): void {
  for (const [key] of states.entries()) {
    if (!keyOrPrefix || key.startsWith(keyOrPrefix)) {
      const current = states.get(key);
      if (current) {
        setState(key, { ...current, loaded: false });
      }
      const fetcher = fetchers.get(key);
      if (fetcher) {
        loadResource(key, fetcher, true).catch(() => {});
      }
    }
  }
}

/**
 * Membersihkan seluruh resource saat logout.
 */
export function clearResources(): void {
  states.clear();
  pending.clear();
  fetchers.clear();
  listeners.forEach((group) => group.forEach((listener) => listener()));
}

/**
 * Hook useResource: Selalu melakukan network request saat mount (Revalidate-on-Mount)
 * untuk menjamin data real-time dari Vercel CDN atau Backend Server.
 */
export function useResource<T>(
  key: string,
  fetcher: () => Promise<T>,
): ResourceState<T> & { reload: () => Promise<void> } {
  const subscribe = useCallback(
    (listener: () => void) => subscribeTo(key, listener),
    [key],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => stateOf(key) as ResourceState<T>,
  );

  // Selalu jalankan fetch network saat hook ter-mount
  useEffect(() => {
    loadResource(key, fetcher, true).catch(() => {});
  }, [key, fetcher]);

  const reload = useCallback(
    () =>
      loadResource(key, fetcher, true)
        .then(() => undefined)
        .catch(() => undefined),
    [key, fetcher],
  );

  return { ...snapshot, reload };
}
