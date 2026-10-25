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

// A request is shared by every component that asks for the same key, and a loaded
// resource is served from cache until something explicitly refreshes it.
export function loadResource<T>(
  key: string,
  fetcher?: () => Promise<T>,
  force = false,
): Promise<T> {
  if (fetcher) fetchers.set(key, fetcher);

  const current = states.get(key) as ResourceState<T> | undefined;
  if (!force && current?.loaded) return Promise.resolve(current.data as T);

  const running = pending.get(key);
  if (running) return running as Promise<T>;

  const run = fetchers.get(key);
  if (!run)
    return Promise.reject(
      new Error(`Resource "${key}" belum memiliki fetcher.`),
    );

  setState(key, { ...(current ?? idle), loading: true, error: null });

  const request = run()
    .then((data) => {
      setState(key, { data, error: null, loading: false, loaded: true });
      return data;
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Gagal memuat data.';
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

// Logout must not leave another account reading the previous account's data.
export function clearResources(): void {
  states.clear();
  pending.clear();
  fetchers.clear();
  listeners.forEach((group) => group.forEach((listener) => listener()));
}

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

  useEffect(() => {
    if (!states.get(key)?.loaded) {
      loadResource(key, fetcher).catch(() => {});
    }
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
