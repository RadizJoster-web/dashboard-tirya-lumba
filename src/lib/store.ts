import { useSyncExternalStore } from 'react';
import { DEMO_PELATIH, DEMO_SISWA } from './demo';
import type { Pelatih, Siswa } from './demo';

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

function plus30(): string {
  return new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
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
  siswa: DEMO_SISWA,
  pelatih: DEMO_PELATIH,
  antrean: [
    { id: 1, tipe: 'Murid', nama: 'Kirana Putri', usia: 8, lokasi: 'Kolam Tirta Jaya', tgl: '2026-10-06', telp: '-' },
    { id: 2, tipe: 'Murid', nama: 'Dewa Mahesa', usia: 9, lokasi: 'Kolam Samudra', tgl: '2026-10-07', telp: '-' },
    { id: 3, tipe: 'Pelatih', nama: 'Coach Reza', usia: 26, lokasi: 'Kolam Bahari', tgl: '2026-10-05', telp: '-' },
    { id: 4, tipe: 'Murid', nama: 'Alya Zahra', usia: 7, lokasi: 'Kolam Tirta Jaya', tgl: '2026-10-08', telp: '-' },
    { id: 5, tipe: 'Pelatih', nama: 'Coach Tari', usia: 24, lokasi: 'Kolam Tirta Jaya', tgl: '2026-10-04', telp: '-' },
  ],
  sesi: [
    { id: 1, lokasi: 'Kolam Tirta Jaya', hari: 'Senin', sesi: 'Sesi 1', jam: '09:00', pelatih: 'Coach Andra' },
    { id: 2, lokasi: 'Kolam Tirta Jaya', hari: 'Rabu', sesi: 'Sesi 2', jam: '15:00', pelatih: 'Coach Andra' },
    { id: 3, lokasi: 'Kolam Samudra', hari: 'Selasa', sesi: 'Sesi 1', jam: '10:00', pelatih: 'Coach Wulan' },
    { id: 4, lokasi: 'Kolam Tirta Jaya', hari: 'Kamis', sesi: 'Sesi 1', jam: '08:00', pelatih: 'Coach Hendra' },
  ],
  resched: [
    { id: 1, pelatih: 'Coach Andra', sesiId: 1, hari: 'Selasa', jam: '09:00', alasan: 'Bentrok jadwal seminar' },
    { id: 2, pelatih: 'Coach Wulan', sesiId: 3, hari: 'Kamis', jam: '10:00', alasan: 'Keperluan keluarga' },
  ],
  lokasi: [
    { id: 1, nama: 'Kolam Tirta Jaya', alamat: 'Jl. Sudirman 12, Jakarta', kategori: 'Outdoor', koordinat: '-6.2088, 106.8456' },
    { id: 2, nama: 'Kolam Samudra', alamat: 'Jl. Melati 5, Bandung', kategori: 'Indoor', koordinat: '-6.9175, 107.6191' },
    { id: 3, nama: 'Kolam Bahari', alamat: 'Jl. Pantai 8, Surabaya', kategori: 'Outdoor', koordinat: '-7.2575, 112.7521' },
  ],
  paket: [
    { id: 1, lokasi: 'Kolam Tirta Jaya', reguler: 350000, privat: 600000 },
    { id: 2, lokasi: 'Kolam Samudra', reguler: 400000, privat: 650000 },
    { id: 3, lokasi: 'Kolam Bahari', reguler: 325000, privat: 575000 },
  ],
  pengelola: [
    { id: 1, nama: 'Budi Santoso', telp: '081234567890', lokasi: 'Kolam Tirta Jaya', foto: '' },
    { id: 2, nama: 'Rina Marlina', telp: '081298765432', lokasi: 'Kolam Samudra', foto: '' },
  ],
  absen: [
    { tgl: '2026-10-05', nama: 'Ayu Pratama', peran: 'Murid', lokasi: 'Kolam Tirta Jaya', st: 'Hadir' },
    { tgl: '2026-10-05', nama: 'Coach Andra', peran: 'Pelatih', lokasi: 'Kolam Tirta Jaya', st: 'Hadir' },
    { tgl: '2026-10-06', nama: 'Dimas Wijaya', peran: 'Murid', lokasi: 'Kolam Samudra', st: 'Tidak Hadir' },
    { tgl: '2026-10-06', nama: 'Coach Wulan', peran: 'Pelatih', lokasi: 'Kolam Samudra', st: 'Hadir' },
  ],
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
      { id: Date.now(), nama: item.nama, usia: item.usia, lokasi: item.lokasi, paket: 'Reguler', berlakuSd: plus30(), aktif: true, telp: item.telp },
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
  state.sesi = state.sesi.filter((s) => s.id !== id);
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
