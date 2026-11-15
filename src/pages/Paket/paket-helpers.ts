import { toast } from 'sonner';
import { apiSend } from '../../lib/api/client';
import type { ServerPackage } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { ImageForm, PackageType, PriceForm } from './types';

export const EMPTY_PRICES: PriceForm = {
  Reguler: '',
  Privat: '',
  Atlit: '',
  Ektrakurikuler: '',
};

export const EMPTY_IMAGES: ImageForm = {
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
      imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : null,
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

export function extractPricesAndImages(
  packages: ServerPackage[],
  locationId: string,
): { prices: PriceForm; images: ImageForm } {
  const prices = { ...EMPTY_PRICES };
  const images = { ...EMPTY_IMAGES };
  if (!locationId) return { prices, images };
  for (const type of PACKAGE_TYPES) {
    const found = priceFor(packages, locationId, type);
    prices[type] = found ? String(found.price) : '';
    images[type] = found?.imageUrl ?? '';
  }
  return { prices, images };
}

export async function sendPackagePriceUpdates(
  activeLocationId: string,
  prices: PriceForm,
  images: ImageForm,
  packages: ServerPackage[],
  reloadPackages: () => void,
): Promise<boolean> {
  const jobs: Promise<ServerPackage>[] = [];
  for (const type of PACKAGE_TYPES) {
    const price = Number(prices[type]);
    const imageUrl = images[type] ? images[type].trim() : null;
    const existing = priceFor(packages, activeLocationId, type);
    if (existing) {
      const priceChanged = existing.price !== price;
      const imageChanged = (existing.imageUrl ?? null) !== imageUrl;
      if (priceChanged || imageChanged) {
        jobs.push(
          apiSend<ServerPackage>(`/packages/${existing.id}`, 'PUT', {
            locationId: activeLocationId,
            type,
            price,
            imageUrl,
          }),
        );
      }
    } else {
      jobs.push(
        apiSend<ServerPackage>('/packages', 'POST', {
          locationId: activeLocationId,
          type,
          price,
          imageUrl,
        }),
      );
    }
  }

  if (jobs.length === 0) {
    toast.info('Tidak ada perubahan harga atau gambar.');
    return true;
  }

  const results = await Promise.allSettled(jobs);
  const failed = results.filter((r) => r.status === 'rejected');
  reloadPackages();

  if (failed.length === 0) {
    toast.success('Paket kursus berhasil diperbarui.');
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
