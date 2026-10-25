import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerArea, ServerLocation } from '../../lib/api/types';

const fetchLocations = (): Promise<ServerLocation[]> =>
  apiGet<ServerLocation[]>('/locations');

const fetchAreas = (): Promise<ServerArea[]> =>
  apiGet<ServerArea[]>('/areas');

export interface LocationPayload {
  name: string;
  areaId: string;
  category: string;
  mapUrl: string;
}

export function useLokasiData() {
  const {
    data,
    loading: locationsLoading,
    reload: reloadLocations,
  } = useResource('/locations', fetchLocations);
  const {
    data: areaData,
    loading: areasLoading,
    reload: reloadAreas,
  } = useResource('/areas', fetchAreas);

  const [saving, setSaving] = useState(false);
  const [savingArea, setSavingArea] = useState(false);

  const rows = useMemo(() => data ?? [], [data]);
  const areas = useMemo(
    () =>
      [...(areaData ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'id')),
    [areaData],
  );
  const isLoading = locationsLoading || areasLoading;

  const areaNames = useMemo(
    () => new Map(areas.map((a) => [a.id, a.name])),
    [areas],
  );

  const groups = useMemo(() => {
    const grouped = new Map<string, ServerLocation[]>();
    for (const location of rows) {
      const areaName =
        location.areaName ||
        (location.areaId ? areaNames.get(location.areaId) : undefined) ||
        'Tanpa area';
      const items = grouped.get(areaName) ?? [];
      items.push(location);
      grouped.set(areaName, items);
    }
    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'id'))
      .map(([name, items]) => ({
        name,
        items: [...items].sort((a, b) => a.name.localeCompare(b.name, 'id')),
      }));
  }, [rows, areaNames]);

  async function saveArea(name: string, id?: string): Promise<boolean> {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Nama area/kota tidak boleh kosong.', {
        style: { color: '#B3341F' },
      });
      return false;
    }
    setSavingArea(true);
    try {
      if (id) {
        await apiSend<ServerArea>(`/areas/${id}`, 'PUT', { name: trimmed });
        toast.success('Data area berhasil diperbarui.');
      } else {
        await apiSend<ServerArea>('/areas', 'POST', { name: trimmed });
        toast.success('Area baru berhasil ditambahkan.');
      }
      await reloadAreas();
      await reloadLocations();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyimpan area.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setSavingArea(false);
    }
  }

  async function deleteArea(id: string): Promise<boolean> {
    setSavingArea(true);
    try {
      await apiSend(`/areas/${id}`, 'DELETE');
      toast.success('Area berhasil dihapus.');
      await reloadAreas();
      await reloadLocations();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menghapus area.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setSavingArea(false);
    }
  }

  async function saveLocation(
    payload: LocationPayload,
    id?: string,
  ): Promise<boolean> {
    setSaving(true);
    try {
      if (id) {
        await apiSend<ServerLocation>(`/locations/${id}`, 'PUT', payload);
        toast.success('Lokasi diperbarui.');
      } else {
        await apiSend<ServerLocation>('/locations', 'POST', payload);
        toast.success('Lokasi ditambahkan.');
      }
      await reloadLocations();
      await reloadAreas();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyimpan lokasi.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteLocation(id: string): Promise<boolean> {
    setSaving(true);
    try {
      await apiSend(`/locations/${id}`, 'DELETE');
      toast.success('Lokasi dihapus.');
      await reloadLocations();
      await reloadAreas();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menghapus lokasi.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    rows,
    areas,
    groups,
    isLoading,
    saving,
    savingArea,
    saveArea,
    deleteArea,
    saveLocation,
    deleteLocation,
    reload: reloadLocations,
    reloadAreas,
  };
}
