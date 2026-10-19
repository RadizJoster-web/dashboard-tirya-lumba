import { useSyncExternalStore } from 'react';

// Local-only until the reschedule endpoint is documented.
export interface Resched {
  id: number;
  pelatih: string;
  sesiId: number;
  hari: string;
  jam: string;
  alasan: string;
}

let resched: Resched[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useResched(): Resched[] {
  return useSyncExternalStore(subscribe, () => resched);
}

export function resolveResched(id: number): void {
  resched = resched.filter((r) => r.id !== id);
  emit();
}
