// Opsi pilihan form pendaftaran, hanya dari data server yang sudah ter-hydrate.
import { useRefData } from './ref-data';
import { HARI, SESI_NAMES } from './format';

export interface Opt {
  id: string;
  label: string;
}

export const GENDER_OPTIONS: string[] = ['Laki-Laki', 'Perempuan'];
export const TSHIRT_OPTIONS: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
export const PAYMENT_OPTIONS: string[] = ['BANK_TRANSFER', 'CASH', 'QRIS'];

export function useLocationOptions(): Opt[] {
  const locations = useRefData((s) => s.locations);
  return locations.map((l) => ({ id: l.id, label: l.name }));
}

export function useInstructorOptions(): Opt[] {
  const instructors = useRefData((s) => s.instructors);
  return instructors.length
    ? instructors.map((t) => ({ id: t.id, label: t.fullName }))
    : [];
}

export interface PackageOpt {
  id: string;
  label: string;
  locationId: string;
}

/** Paket per lokasi. Yang belum tersambung ke server: ['REGULER', 'PRIVAT'] tanpa harga. */
export function usePackageOptions(): PackageOpt[] {
  const packages = useRefData((s) => s.packages);
  return packages.map((p) => ({
    id: p.id,
    locationId: p.locationId,
    label: `${p.type}${p.price > 0 ? ` — Rp ${p.price.toLocaleString('id-ID')}` : ''}`,
  }));
}

export const DAY_OPTIONS: Opt[] = HARI.map((h) => ({ id: h, label: h }));
export const SESSION_OPTIONS: Opt[] = SESI_NAMES.map((s) => ({ id: s, label: s }));
