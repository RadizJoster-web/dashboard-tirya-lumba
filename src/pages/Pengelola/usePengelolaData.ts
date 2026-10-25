import { useMemo } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerLocation, ServerPoolManager } from '../../lib/api/types';

const fetchManagers = (): Promise<ServerPoolManager[]> =>
  apiGet<ServerPoolManager[]>('/pool-managers');

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

export interface NewManagerPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  locationId: string;
  isActive?: boolean;
}

export function usePengelolaData() {
  const {
    data,
    loading: isLoading,
    reload,
  } = useResource('/pool-managers', fetchManagers);
  const { data: locationData, loading: locationsLoading } = useResource(
    '/locations',
    fetchLocations,
  );

  const rows = useMemo(() => data ?? [], [data]);
  const locations = useMemo(() => locationData ?? [], [locationData]);

  const locationName = useMemo(
    () => new Map(locations.map((l) => [l.id, l.name])),
    [locations],
  );

  const crudRows = useMemo(
    () =>
      rows.map((r, i) => ({
        id: i + 1,
        serverId: r.id,
        nama: r.fullName,
        email: r.email,
        telp: r.phone ?? '-',
        lokasi:
          r.location?.name ??
          (r.locationId ? locationName.get(r.locationId) ?? '-' : '-'),
        locationId: r.locationId ?? '',
      })),
    [rows, locationName],
  );

  const locationOptions = useMemo(
    () => locations.map((l) => ({ value: l.id, label: l.name })),
    [locations],
  );

  async function addManager(payload: NewManagerPayload): Promise<boolean> {
    try {
      await apiSend<ServerPoolManager>('/pool-managers', 'POST', payload);
      await reload();
      toast.success('Pengelola ditambahkan.');
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menambahkan pengelola.',
        { style: { color: '#B3341F' } },
      );
      return false;
    }
  }

  async function updateManager(
    id: string,
    payload: Partial<ServerPoolManager>,
  ): Promise<boolean> {
    try {
      await apiSend<ServerPoolManager>(`/pool-managers/${id}`, 'PUT', payload);
      await reload();
      toast.success('Pengelola diperbarui.');
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal memperbarui pengelola.',
        { style: { color: '#B3341F' } },
      );
      return false;
    }
  }

  async function deleteManager(id: string): Promise<boolean> {
    try {
      await apiSend(`/pool-managers/${id}`, 'DELETE');
      await reload();
      toast.success('Pengelola dihapus.');
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menghapus pengelola.',
        { style: { color: '#B3341F' } },
      );
      return false;
    }
  }

  return {
    rows,
    locations,
    locationName,
    crudRows,
    locationOptions,
    isLoading: isLoading || locationsLoading,
    addManager,
    updateManager,
    deleteManager,
  };
}
