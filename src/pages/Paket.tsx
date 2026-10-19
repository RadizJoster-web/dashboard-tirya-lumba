import { useMemo } from 'react';
import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import { SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { formatRp } from '../lib/format';
import { apiSend } from '../lib/api';
import { API_KEYS, fetchLocations, fetchPackages } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';
import type { ServerPackage } from '../lib/api-types';

export default function Paket() {
  const { data: packageData, loading: packagesLoading, reload: reloadPackages } = useResource(API_KEYS.packages, fetchPackages);
  const { data: locationData, loading: locationsLoading } = useResource(API_KEYS.locations, fetchLocations);
  const packages = useMemo(() => packageData ?? [], [packageData]);
  const locations = useMemo(() => locationData ?? [], [locationData]);

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

  async function addPackage(payload: { locationId: string; type: string; price: number }) {
    try {
      await apiSend<ServerPackage>('/packages', 'POST', payload);
      await reloadPackages();
      toast.success('Paket ditambahkan.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan paket.', { style: { color: '#B3341F' } });
    }
  }

  async function updatePackage(id: string, payload: Partial<ServerPackage>) {
    try {
      await apiSend<ServerPackage>(`/packages/${id}`, 'PUT', payload);
      await reloadPackages();
      toast.success('Paket diperbarui.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui paket.', { style: { color: '#B3341F' } });
    }
  }

  async function deletePackage(id: string) {
    try {
      await apiSend<ServerPackage>(`/packages/${id}`, 'DELETE');
      await reloadPackages();
      toast.success('Paket dihapus.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus paket.', { style: { color: '#B3341F' } });
    }
  }

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data harga dan paket">
        <SkeletonHeader action />
        <SkeletonTable rows={6} cols={4} />
      </SkeletonPage>
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
        void addPackage({ locationId: loc?.id ?? d.locationId, type: d.type, price: Number(d.harga) });
      }}
      onEdit={(id, d) => {
        const r = rows.find((x) => x.id === id);
        const loc = locations.find((l) => l.name === d.locationId);
        void updatePackage(r?.serverId ?? '', { locationId: loc?.id ?? r?.locationId, type: d.type, price: Number(d.harga) });
      }}
      onDelete={(id) => {
        const r = rows.find((x) => x.id === id);
        void deletePackage(r?.serverId ?? '');
      }}
    />
  );
}
