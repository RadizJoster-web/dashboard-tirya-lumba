import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { apiGet, apiGetPayload } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerLocation, ServerPackage } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { PriceForm } from './types';
import {
  EMPTY_PRICES,
  parsePackagesResponse,
  priceFor,
  sendPackagePriceUpdates,
} from './paket-helpers';
import type { PackagesResponse } from './paket-helpers';

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

export function usePaketData() {
  const { data: locationData, loading: locationsLoading } = useResource(
    '/locations',
    fetchLocations,
  );
  const locations = useMemo(() => locationData ?? [], [locationData]);

  const [locationId, setLocationId] = useState('');
  const [saving, setSaving] = useState(false);
  const [packageResult, setPackageResult] = useState<{
    locationId: string;
    packages: ServerPackage[];
  } | null>(null);
  const [packageRequestError, setPackageRequestError] = useState<{
    requestKey: string;
    message: string;
  } | null>(null);
  const [completedPackageRequestKey, setCompletedPackageRequestKey] = useState<
    string | null
  >(null);
  const [packagesRefresh, setPackagesRefresh] = useState(0);

  const activeLocationId = locationId || locations[0]?.id || '';
  const packageRequestKey = `${activeLocationId}:${packagesRefresh}`;

  const packages = useMemo(() => {
    return packageResult?.locationId === activeLocationId
      ? packageResult.packages
      : [];
  }, [packageResult, activeLocationId]);

  const packagesLoading =
    Boolean(activeLocationId) &&
    completedPackageRequestKey !== packageRequestKey;

  const packagesError =
    packageRequestError?.requestKey === packageRequestKey
      ? packageRequestError.message
      : null;

  const reloadPackages = useCallback(() => {
    setPackagesRefresh((refresh) => refresh + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!activeLocationId) return;

    apiGetPayload<PackagesResponse>(
      `/packages/${encodeURIComponent(activeLocationId)}`,
    )
      .then((response) => parsePackagesResponse(response, activeLocationId))
      .then((data) => {
        if (!cancelled) {
          setPackageResult({ locationId: activeLocationId, packages: data });
          setPackageRequestError(null);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPackageRequestError({
            requestKey: packageRequestKey,
            message:
              error instanceof Error
                ? error.message
                : 'Gagal memuat data paket.',
          });
        }
      })
      .finally(() => {
        if (!cancelled) setCompletedPackageRequestKey(packageRequestKey);
      });

    return () => {
      cancelled = true;
    };
  }, [activeLocationId, packageRequestKey]);

  const savedPrices = useMemo(() => {
    const next = { ...EMPTY_PRICES };

    if (!activeLocationId) return next;

    for (const type of PACKAGE_TYPES) {
      const found = priceFor(packages, activeLocationId, type);
      next[type] = found ? String(found.price) : '';
    }
    return next;
  }, [activeLocationId, packages]);

  const savePrices = useCallback(
    async (prices: PriceForm): Promise<boolean> => {
      if (!activeLocationId) {
        toast.error('Pilih lokasi terlebih dahulu.', {
          style: { color: '#B3341F' },
        });
        return false;
      }

      setSaving(true);
      try {
        return await sendPackagePriceUpdates(
          activeLocationId,
          prices,
          packages,
          reloadPackages,
        );
      } finally {
        setSaving(false);
      }
    },
    [activeLocationId, packages, reloadPackages],
  );

  return {
    locations,
    locationsLoading,
    activeLocationId,
    changeLocation: setLocationId,
    packages,
    packagesLoading,
    packagesError,
    reloadPackages,
    savedPrices,
    savePrices,
    saving,
  };
}
