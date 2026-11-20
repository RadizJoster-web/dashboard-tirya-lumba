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

export function stateOf(key: string): ResourceState<unknown> {
  return states.get(key) ?? idle;
}

function setState(key: string, next: ResourceState<unknown>): void {
  states.set(key, next);
  listeners.get(key)?.forEach((listener) => listener());
}

export function subscribeTo(key: string, listener: () => void): () => void {
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

export function loadResource<T>(
  key: string,
  fetcher?: () => Promise<T>,
  force = false,
): Promise<T> {
  if (fetcher) fetchers.set(key, fetcher);

  const current = states.get(key) as ResourceState<T> | undefined;

  if (!force) {
    const running = pending.get(key);
    if (running) return running as Promise<T>;
  }

  const run = fetchers.get(key);
  if (!run) {
    return Promise.reject(new Error(`Resource "${key}" belum memiliki fetcher.`));
  }

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

export function clearResources(): void {
  states.clear();
  pending.clear();
  fetchers.clear();
  listeners.forEach((group) => group.forEach((listener) => listener()));
}

export { useResource } from './useResource';
