import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import { formatRp } from '../lib/format';
import { apiGet, apiSend } from '../lib/api';
import type { ServerPackage, ServerLocation } from '../lib/api-types';

export default function Paket() {
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => apiGet<ServerPackage[]>('/packages'),
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => apiGet<ServerLocation[]>('/locations'),
  });

  const isLoading = packagesLoading || locationsLoading;

  const locationNames = useMemo(() => new Map(locations.map((l) => [l.id, l.name])), [locations]);

  const rows = useMemo(() =>
    packages.map((p, idx) => ({
      id: idx + 1,
      serverId: p.id,
      lokasi: locationNames.get(p.locationId) ?? p.locationId,
      type: p.type,
      harga: p.price,
      locationId: p.locationId,
    })),
  [packages, locationNames]);

  const addMutation = useMutation({
    mutationFn: (payload: { locationId: string; type: string; price: number; meetCount?: number }) =>
      apiSend<ServerPackage>('/packages', 'POST', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket ditambahkan.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menambahkan paket.', { style: { color: '#B3341F' } }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ServerPackage> }) =>
      apiSend<ServerPackage>(`/packages/${id}`, 'PUT', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket diperbarui.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal memperbarui paket.', { style: { color: '#B3341F' } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiSend<ServerPackage>(`/packages/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      toast.success('Paket dihapus.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menghapus paket.', { style: { color: '#B3341F' } }),
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data paket…</div>
    );
  }

  return (
    <CrudPage
      title="Harga dan Paket"
      subtitle="Dipakai sebagai referensi harga di form pendaftaran Landing Page"
      addLabel="+ Tambah paket"
      fields={[
        { key: 'locationId', label: 'Lokasi', type: 'select', options: locations.map((l) => l.name), required: true },
        { key: 'type', label: 'Tipe', type: 'select', options: ['Reguler', 'Privat'], required: true },
        { key: 'harga', label: 'Harga (Rp)', type: 'number', required: true },
      ]}
      columns={[
        { key: 'lokasi', header: 'Lokasi' },
        { key: 'type', header: 'Tipe' },
        { key: 'harga', header: 'Harga', render: (v) => formatRp(Number(v)) },
      ]}
      rows={rows}
      initialOf={(id) => {
        const r = rows.find((x) => x.id === id);
        return { locationId: r?.locationId ?? '', type: r?.type ?? 'Reguler', harga: String(r?.harga ?? '') };
      }}
      onAdd={(d) => {
        const loc = locations.find((l) => l.name === d.locationId);
        addMutation.mutate({ locationId: loc?.id ?? d.locationId, type: d.type, price: Number(d.harga) });
      }}
      onEdit={(id, d) => {
        const r = rows.find((x) => x.id === id);
        const loc = locations.find((l) => l.name === d.locationId);
        updateMutation.mutate({ id: r?.serverId ?? '', payload: { locationId: loc?.id ?? r?.locationId, type: d.type, price: Number(d.harga) } });
      }}
      onDelete={(id) => {
        const r = rows.find((x) => x.id === id);
        deleteMutation.mutate(r?.serverId ?? '');
      }}
    />
  );
}
