export const PACKAGE_TYPES = [
  'Reguler',
  'Privat',
  'Atlit',
  'Ektrakurikuler',
] as const;
export type PackageType = (typeof PACKAGE_TYPES)[number];
export type PriceForm = Record<PackageType, string>;
