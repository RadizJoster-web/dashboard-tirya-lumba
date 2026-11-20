import { toast } from 'sonner';
import { apiSend } from '../../lib/api/client';
import type { ServerPackage } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { PackageType, PriceForm } from './types';

export const EMPTY_PRICES: PriceForm = {
  Reguler: '',
  Privat: '',
  Atlit: '',
  Ektrakurikuler: '',
};

export interface PackagesResponse {
  packages?: unknown;
}

export function parsePackagesResponse(
  response: PackagesResponse,
  locationId: string,
): ServerPackage[] {
  if (!Array.isArray(response.packages)) {
    throw new Error('Respons paket lokasi tidak berisi daftar packages.');
  }

  return response.packages.map((item: unknown) => {
    const raw = item as Record<string, unknown>;
    if (!raw || typeof raw !== 'object' || typeof raw.id !== 'string') {
      throw new Error('Data paket dari server memiliki format yang tidak valid.');
    }

    return {
      id: raw.id as string,
      type: typeof raw.type === 'string' ? raw.type : '',
      price: typeof raw.price === 'number' ? raw.price : 0,
      sessionCount: typeof raw.sessionCount === 'number' ? raw.sessionCount : 4,
      locationId,
    };
  });
}

export function priceFor(
  packages: ServerPackage[],
  locationId: string,
  type: PackageType,
): ServerPackage | undefined {
  return packages.find(
    (p) =>
      p.locationId === locationId &&
      p.type.toLowerCase() === type.toLowerCase(),
  );
}

export function extractPrices(
  packages: ServerPackage[],
  locationId: string,
): PriceForm {
  const prices = { ...EMPTY_PRICES };
  if (!locationId) return prices;
  for (const type of PACKAGE_TYPES) {
    const found = priceFor(packages, locationId, type);
    prices[type] = found ? String(found.price) : '';
  }
  return prices;
}

export async function sendPackagePriceUpdates(
  activeLocationId: string,
  prices: PriceForm,
  packages: ServerPackage[],
  reloadPackages: () => void,
): Promise<boolean> {
  const jobs: Promise<ServerPackage>[] = [];
  for (const type of PACKAGE_TYPES) {
    const price = Number(prices[type]);
    const existing = priceFor(packages, activeLocationId, type);
    if (existing) {
      if (existing.price !== price) {
        jobs.push(
          apiSend<ServerPackage>(`/packages/${existing.id}`, 'PUT', {
            locationId: activeLocationId,
            type,
            price,
          }),
        );
      }
    } else if (prices[type] !== '') {
      jobs.push(
        apiSend<ServerPackage>('/packages', 'POST', {
          locationId: activeLocationId,
          type,
          price,
        }),
      );
    }
  }

  if (jobs.length === 0) {
    toast.info('Tidak ada perubahan harga.');
    return true;
  }

  const results = await Promise.allSettled(jobs);
  const failed = results.filter((r) => r.status === 'rejected');
  reloadPackages();

  if (failed.length === 0) {
    toast.success('Harga paket berhasil disimpan.');
    return true;
  }
  const firstError = failed[0].status === 'rejected' ? failed[0].reason : null;
  toast.error(
    firstError instanceof Error
      ? `${failed.length} paket gagal disimpan: ${firstError.message}`
      : `${failed.length} paket gagal disimpan.`,
    { style: { color: '#B3341F' } },
  );
  return false;
}
