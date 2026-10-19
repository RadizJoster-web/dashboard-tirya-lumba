import { useSyncExternalStore } from 'react';

// Local-only until the registration approval endpoints are documented.
export interface Antrean {
  id: number;
  tipe: 'Murid' | 'Pelatih';
  nama: string;
  usia: number;
  lokasi: string;
  tgl: string;
  telp: string;
}

let antrean: Antrean[] = [];
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

export function useAntrean(): Antrean[] {
  return useSyncExternalStore(subscribe, () => antrean);
}

export function approveAntrean(id: number): Antrean | null {
  const item = antrean.find((a) => a.id === id) ?? null;
  if (!item) return null;
  antrean = antrean.filter((a) => a.id !== id);
  emit();
  return item;
}

export function rejectAntrean(id: number): Antrean | null {
  const item = antrean.find((a) => a.id === id) ?? null;
  if (!item) return null;
  antrean = antrean.filter((a) => a.id !== id);
  emit();
  return item;
}
