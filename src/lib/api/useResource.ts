import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { loadResource, stateOf, subscribeTo, type ResourceState } from './cache';

export function useResource<T>(
  key: string,
  fetcher: () => Promise<T>,
): ResourceState<T> & { reload: () => Promise<void> } {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const subscribe = useCallback(
    (listener: () => void) => subscribeTo(key, listener),
    [key],
  );
  const snapshot = useSyncExternalStore(
    subscribe,
    () => stateOf(key) as ResourceState<T>,
  );

  useEffect(() => {
    loadResource(key, fetcherRef.current, true).catch(() => {});
  }, [key]);

  const reload = useCallback(
    () =>
      loadResource(key, fetcherRef.current, true)
        .then(() => undefined)
        .catch(() => undefined),
    [key],
  );

  return { ...snapshot, reload };
}
