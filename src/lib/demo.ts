export const LOCATIONS = ['Kolam Tirta Jaya', 'Kolam Samudra', 'Kolam Bahari'] as const;

export const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export const MONTHS_FULL = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const YEARS = [2025, 2026];

export const REG_PRICE = 350000;

export const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const SESI_NAMES = ['Sesi 1', 'Sesi 2', 'Sesi 3'];

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

const FIRST = ['Ayu', 'Rina', 'Dimas', 'Salsa', 'Raka', 'Nadia', 'Fajar', 'Putri', 'Bima', 'Citra', 'Eko', 'Laras', 'Yoga', 'Mita'];
const LAST = ['Pratama', 'Sari', 'Wijaya', 'Saputra', 'Hidayat', 'Kusuma', 'Wulandari', 'Santoso', 'Rahmawati', 'Purnama'];

// Demo dataset mirroring the HTML prototype, plus usia for the Siswa table.
export const DEMO_SISWA: Siswa[] = FIRST.map((n, i) => ({
  id: i + 1,
  nama: `${n} ${LAST[i % 10]}`,
  usia: 6 + ((i * 7 + 3) % 10),
  lokasi: LOCATIONS[i % 3],
  berlakuSd: `2026-${String(i % 5 ? 11 : 9).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
  aktif: i !== 5 && i !== 9,
  paket: i % 4 ? 'Reguler' : 'Privat',
  telp: `0812000${1000 + i}`,
}));

export const DEMO_PELATIH: Pelatih[] = [
  { id: 1, nama: 'Coach Andra', lokasi: LOCATIONS[0], lisensi: 'Instruktur Renang Nasional Lv.2', jadwal: 'Senin 09.00, Rabu 15.00', riwayat: '128 sesi, sejak 2023' },
  { id: 2, nama: 'Coach Wulan', lokasi: LOCATIONS[1], lisensi: 'Lifeguard & Swim Coach', jadwal: 'Selasa 10.00, Jumat 16.00', riwayat: '96 sesi, sejak 2024' },
  { id: 3, nama: 'Coach Hendra', lokasi: LOCATIONS[0], lisensi: 'Instruktur Renang Nasional Lv.1', jadwal: 'Kamis 08.00', riwayat: '54 sesi, sejak 2025' },
  { id: 4, nama: 'Coach Sinta', lokasi: LOCATIONS[2], lisensi: 'Swim Coach Anak', jadwal: 'Sabtu 09.00', riwayat: '77 sesi, sejak 2024' },
  { id: 5, nama: 'Coach Rifat', lokasi: LOCATIONS[1] },
];

export function seedRegistrations(year: number, monthIndex: number, scoped: boolean): number {
  return Math.round((18 + ((year * 7 + monthIndex * 13) % 23)) * (scoped ? 0.34 : 1));
}

export function registrationsForYear(year: number, scoped: boolean): number[] {
  return MONTHS_SHORT.map((_, i) => seedRegistrations(year, i, scoped));
}

export function weeklySplit(year: number, month: number, scoped: boolean): number[] {
  const seed = seedRegistrations(year, month - 1, scoped);
  return [1, 2, 3, 4].map((w) => Math.round(seed / 4 + ((w * 3 + month) % 3)));
}

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}
