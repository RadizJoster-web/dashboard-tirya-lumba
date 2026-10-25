export const PACKAGE_TYPES = [
  'Reguler',
  'Privat',
  'Atlit',
  'Beasiswa',
] as const;
export type PackageType = (typeof PACKAGE_TYPES)[number];
export type PriceForm = Record<PackageType, string>;
