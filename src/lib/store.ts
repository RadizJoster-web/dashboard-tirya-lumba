import { useSyncExternalStore } from 'react';

export interface Antrean {
  id: number;
  tipe: 'Murid' | 'Pelatih';
  nama: string;
  usia: number;
  lokasi: string;
  tgl: string;
  telp: string;
}

export interface Sesi {
  id: number;
  lokasi: string;
  hari: string;
  sesi: string;
  jam: string;
  pelatih: string;
}

export interface Resched {
  id: number;
  pelatih: string;
  sesiId: number;
  hari: string;
  jam: string;
  alasan: string;
}

export interface Lokasi {
  id: number;
  nama: string;
  alamat: string;
  kategori: string;
  koordinat: string;
}

export interface Paket {
  id: number;
  lokasi: string;
  reguler: number;
  privat: number;
}

export interface Pengelola {
  id: number;
  nama: string;
  telp: string;
  lokasi: string;
  foto: string;
  fotoUrl?: string;
}

export interface Absen {
  tgl: string;
  nama: string;
  peran: 'Murid' | 'Pelatih';
  lokasi: string;
  st: 'Hadir' | 'Tidak Hadir';
}

export interface Siswa {
  id: number;
  nama: string;
  usia: number;
  lokasi: string;
  berlakuSd: string;
  aktif: boolean;
  paket: string;
  telp: string;
}

export interface Pelatih {
  id: number;
  nama: string;
  lokasi: string;
  lisensi?: string;
  jadwal?: string;
  riwayat?: string;
}

interface StoreState {
  siswa: Siswa[];
  pelatih: Pelatih[];
  antrean: Antrean[];
  sesi: Sesi[];
  resched: Resched[];
  lokasi: Lokasi[];
  paket: Paket[];
  pengelola: Pengelola[];
  absen: Absen[];
}

const state: StoreState = {
  siswa: [],
  pelatih: [],
  antrean: [],
  sesi: [],
  resched: [],
  lokasi: [],
  paket: [],
  pengelola: [],
  absen: [],
};

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useSiswa(): Siswa[] {
  return useSyncExternalStore(subscribe, () => state.siswa);
}

export function usePelatih(): Pelatih[] {
  return useSyncExternalStore(subscribe, () => state.pelatih);
}

export function useAntrean(): Antrean[] {
  return useSyncExternalStore(subscribe, () => state.antrean);
}

export function useSesi(): Sesi[] {
  return useSyncExternalStore(subscribe, () => state.sesi);
}

export function useResched(): Resched[] {
  return useSyncExternalStore(subscribe, () => state.resched);
}

export function useLokasi(): Lokasi[] {
  return useSyncExternalStore(subscribe, () => state.lokasi);
}

export function usePaket(): Paket[] {
  return useSyncExternalStore(subscribe, () => state.paket);
}

export function usePengelola(): Pengelola[] {
  return useSyncExternalStore(subscribe, () => state.pengelola);
}

export function useAbsen(): Absen[] {
  return useSyncExternalStore(subscribe, () => state.absen);
}

export function hydrateLokasi(rows: Lokasi[]): void {
  state.lokasi = rows;
  emit();
}

export function hydratePaket(rows: Paket[]): void {
  state.paket = rows;
  emit();
}

export function hydratePelatih(rows: Pelatih[]): void {
  state.pelatih = rows;
  emit();
}

export function hydratePengelola(rows: Pengelola[]): void {
  state.pengelola = rows;
  emit();
}

export function hydrateAbsen(rows: Absen[]): void {
  state.absen = rows;
  emit();
}

export function updateSiswa(id: number, patch: Partial<Siswa>): void {
  state.siswa = state.siswa.map((r) => (r.id === id ? { ...r, ...patch } : r));
  emit();
}

export function approveAntrean(id: number): Antrean | null {
  const item = state.antrean.find((a) => a.id === id) ?? null;
  if (!item) return null;
  state.antrean = state.antrean.filter((a) => a.id !== id);
  if (item.tipe === 'Murid') {
    state.siswa = [
      ...state.siswa,
      { id: Date.now(), nama: item.nama, usia: item.usia, lokasi: item.lokasi, paket: 'Reguler', berlakuSd: '', aktif: true, telp: item.telp },
    ];
  } else {
    state.pelatih = [...state.pelatih, { id: Date.now(), nama: item.nama, lokasi: item.lokasi }];
  }
  emit();
  return item;
}

export function rejectAntrean(id: number): Antrean | null {
  const item = state.antrean.find((a) => a.id === id) ?? null;
  if (!item) return null;
  state.antrean = state.antrean.filter((a) => a.id !== id);
  emit();
  return item;
}

export function addSesi(s: Omit<Sesi, 'id'>): void {
  state.sesi = [...state.sesi, { ...s, id: Date.now() }];
  emit();
}

export function updateSesi(id: number, patch: Partial<Sesi>): void {
  state.sesi = state.sesi.map((s) => (s.id === id ? { ...s, ...patch } : s));
  emit();
}

export function deleteSesi(id: number): void {
  state.sesi = state.sesi.filter((s) => s.id === id);
  emit();
}

export function resolveResched(id: number, ok: boolean): void {
  const req = state.resched.find((r) => r.id === id);
  if (!req) return;
  if (ok) {
    state.sesi = state.sesi.map((s) => (s.id === req.sesiId ? { ...s, hari: req.hari, jam: req.jam } : s));
  }
  state.resched = state.resched.filter((r) => r.id !== id);
  emit();
}

export function addLokasi(d: Omit<Lokasi, 'id'>): void {
  state.lokasi = [...state.lokasi, { ...d, id: Date.now() }];
  emit();
}

export function updateLokasi(id: number, patch: Partial<Lokasi>): void {
  state.lokasi = state.lokasi.map((l) => (l.id === id ? { ...l, ...patch } : l));
  emit();
}

export function deleteLokasi(id: number): void {
  state.lokasi = state.lokasi.filter((l) => l.id !== id);
  emit();
}

export function addPaket(d: Omit<Paket, 'id'>): void {
  state.paket = [...state.paket, { ...d, id: Date.now() }];
  emit();
}

export function updatePaket(id: number, patch: Partial<Paket>): void {
  state.paket = state.paket.map((p) => (p.id === id ? { ...p, ...patch } : p));
  emit();
}

export function deletePaket(id: number): void {
  state.paket = state.paket.filter((p) => p.id !== id);
  emit();
}

export function addPengelola(d: Omit<Pengelola, 'id'>): void {
  state.pengelola = [...state.pengelola, { ...d, id: Date.now() }];
  emit();
}

export function updatePengelola(id: number, patch: Partial<Pengelola>): void {
  state.pengelola = state.pengelola.map((p) => (p.id === id ? { ...p, ...patch } : p));
  emit();
}

export function deletePengelola(id: number): void {
  state.pengelola = state.pengelola.filter((p) => p.id !== id);
  emit();
}

export function pushAbsen(rows: Absen[]): void {
  state.absen = [...state.absen, ...rows];
  emit();
}
