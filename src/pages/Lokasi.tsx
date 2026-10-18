import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import { apiGet, apiSend } from '../lib/api';
import type { ServerLocation } from '../lib/api-types';

export default function Lokasi() {
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['lokasi'],
    queryFn: () => apiGet<ServerLocation[]>('/locations'),
  });

  const addMutation = useMutation({
    mutationFn: (payload: { nama: string; areaId: string; category: string; mapUrl: string }) =>
      apiSend<ServerLocation>('/locations', 'POST', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi ditambahkan.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menambahkan lokasi.', { style: { color: '#B3341F' } }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ServerLocation> }) =>
      apiSend<ServerLocation>(`/locations/${id}`, 'PUT', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi diperbarui.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal memperbarui lokasi.', { style: { color: '#B3341F' } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiSend<ServerLocation>(`/locations/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lokasi'] });
      toast.success('Lokasi dihapus.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menghapus lokasi.', { style: { color: '#B3341F' } }),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data lokasi…</div>
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
      onAdd={(d) => addMutation.mutate({ nama: d.nama, areaId: d.areaId, category: d.kategori, mapUrl: d.mapUrl })}
      onEdit={(id, d) => {
        const r = crudRows.find((x) => x.id === id);
        updateMutation.mutate({ id: r?.serverId ?? '', payload: { name: d.nama, areaId: d.areaId, category: d.kategori, mapUrl: d.mapUrl } });
      }}
      onDelete={(id) => {
        const r = crudRows.find((x) => x.id === id);
        deleteMutation.mutate(r?.serverId ?? '');
      }}
    />
  );
}
