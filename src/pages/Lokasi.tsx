import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import { SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { apiSend } from '../lib/api';
import { API_KEYS, fetchLocations } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';
import type { ServerLocation } from '../lib/api-types';

export default function Lokasi() {
  const { data, loading: isLoading, reload } = useResource(API_KEYS.locations, fetchLocations);
  const rows = data ?? [];

  async function addLocation(payload: { nama: string; areaId: string; category: string; mapUrl: string }) {
    try {
      await apiSend<ServerLocation>('/locations', 'POST', payload);
      await reload();
      toast.success('Lokasi ditambahkan.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan lokasi.', { style: { color: '#B3341F' } });
    }
  }

  async function updateLocation(id: string, payload: Partial<ServerLocation>) {
    try {
      await apiSend<ServerLocation>(`/locations/${id}`, 'PUT', payload);
      await reload();
      toast.success('Lokasi diperbarui.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui lokasi.', { style: { color: '#B3341F' } });
    }
  }

  async function deleteLocation(id: string) {
    try {
      await apiSend<ServerLocation>(`/locations/${id}`, 'DELETE');
      await reload();
      toast.success('Lokasi dihapus.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus lokasi.', { style: { color: '#B3341F' } });
    }
  }

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data lokasi">
        <SkeletonHeader action />
        <SkeletonTable rows={6} cols={5} />
      </SkeletonPage>
    );
  }

  const crudRows = rows.map((r, i) => ({
    id: i + 1,
    serverId: r.id,
    nama: r.name,
    alamat: r.areaId ?? '-',
    kategori: r.category ?? '-',
    koordinat: r.mapUrl ?? '-',
  }));

  return (
    <CrudPage
      title="Lokasi Kolam"
      subtitle="Data lokasi dan kategori kolam renang"
      addLabel="+ Tambah lokasi"
      fields={[
        { key: 'nama', label: 'Nama kolam', required: true },
        { key: 'areaId', label: 'Area ID', type: 'text', required: true },
        { key: 'category', label: 'Kategori', type: 'select', options: ['Indoor', 'Outdoor'], required: true },
        { key: 'mapUrl', label: 'Map URL', type: 'text', required: true },
      ]}
      columns={[
        { key: 'nama', header: 'Nama' },
        { key: 'alamat', header: 'Area ID' },
        { key: 'kategori', header: 'Kategori' },
        { key: 'koordinat', header: 'Map URL' },
      ]}
      rows={crudRows}
      initialOf={(id) => {
        const r = crudRows.find((x) => x.id === id);
        const server = rows.find((x) => x.id === r?.serverId);
        return { nama: r?.nama ?? '', areaId: server?.areaId ?? '', kategori: r?.kategori ?? 'Indoor', mapUrl: r?.koordinat ?? '' };
      }}
      onAdd={(d) => void addLocation({ nama: d.nama, areaId: d.areaId, category: d.kategori, mapUrl: d.mapUrl })}
      onEdit={(id, d) => {
        const r = crudRows.find((x) => x.id === id);
        void updateLocation(r?.serverId ?? '', { name: d.nama, areaId: d.areaId, category: d.kategori, mapUrl: d.mapUrl });
      }}
      onDelete={(id) => {
        const r = crudRows.find((x) => x.id === id);
        void deleteLocation(r?.serverId ?? '');
      }}
    />
  );
}
