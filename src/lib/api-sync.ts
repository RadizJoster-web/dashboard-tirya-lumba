import { useEffect } from 'react';
import { apiGet, getToken } from './api';
import { useApiMode } from './api-mode';
import type { ServerArea, ServerInstructor, ServerLocation, ServerPackage, ServerPoolManager } from './api-types';
import { hydrateLokasi, hydratePaket, hydratePelatih, hydratePengelola } from './store';
import { setRefInstructors, setRefLocations, setRefPackages } from './ref-data';
import type { Paket } from './store';

// Pull master data from the server and hydrate the local store. Any endpoint that fails keeps
// its demo rows, so the dashboard stays usable while the backend is offline.
export function useApiSync(): void {
  const setMode = useApiMode((s) => s.setMode);

  useEffect(() => {
    if (!getToken()) {
      setMode('demo');
      return;
    }
    let cancelled = false;
    setMode('checking');

    (async () => {
      const [areas, locations, packages, instructors, managers] = await Promise.allSettled([
        apiGet<ServerArea[]>('/areas'),
        apiGet<ServerLocation[]>('/locations'),
        apiGet<ServerPackage[]>('/packages'),
        apiGet<ServerInstructor[]>('/instructor/management?page=1&limit=100'),
        apiGet<ServerPoolManager[]>('/pool-managers'),
      ]);
      if (cancelled) return;

      const areaNames = new Map<string, string>();
      if (areas.status === 'fulfilled') {
        for (const a of areas.value) areaNames.set(a.id, a.name);
      }

      const locationNames = new Map<string, string>();
      if (locations.status === 'fulfilled') {
        for (const l of locations.value) locationNames.set(l.id, l.name);
        setRefLocations(locations.value);
      }

      let live = false;

      if (locations.status === 'fulfilled') {
        hydrateLokasi(
          locations.value.map((l, i) => ({
            id: i + 1,
            nama: l.name,
            alamat: (l.areaId ? areaNames.get(l.areaId) : undefined) ?? l.category ?? '-',
            kategori: l.category ?? '-',
            koordinat: l.mapUrl ?? '-',
          })),
        );
        live = true;
      }

      if (packages.status === 'fulfilled' && locations.status === 'fulfilled') {
        const grouped = new Map<string, Paket>();
        for (const p of packages.value) {
          const row = grouped.get(p.locationId) ?? {
            id: grouped.size + 1,
            lokasi: locationNames.get(p.locationId) ?? p.locationId,
            reguler: 0,
            privat: 0,
          };
          if (p.type.toLowerCase() === 'privat') row.privat = p.price;
          else row.reguler = p.price;
          grouped.set(p.locationId, row);
        }
        hydratePaket([...grouped.values()]);
        setRefPackages(packages.value);
        live = true;
      }

      if (instructors.status === 'fulfilled') {
        hydratePelatih(
          instructors.value.map((t, i) => ({
            id: i + 1,
            nama: t.fullName,
            lokasi: '-',
          })),
        );
        setRefInstructors(instructors.value);
        live = true;
      }

      if (managers.status === 'fulfilled') {
        hydratePengelola(
          managers.value.map((m, i) => ({
            id: i + 1,
            nama: m.fullName,
            telp: m.phone ?? '-',
            lokasi: m.location?.name ?? '-',
            foto: '',
          })),
        );
        live = true;
      }

      setMode(live ? 'live' : 'demo');
    })();

    return () => {
      cancelled = true;
    };
  }, [setMode]);
}
