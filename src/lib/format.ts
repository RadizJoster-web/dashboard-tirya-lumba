export function initials(nama: string): string {
  return nama
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const MONTHS_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const YEARS = [2025, 2026];

export const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export const SESI_NAMES = ['Sesi 1', 'Sesi 2', 'Sesi 3'];

export const LOCATIONS = ['Kolam Tirta Jaya', 'Kolam Samudra', 'Kolam Bahari'] as const;

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}
