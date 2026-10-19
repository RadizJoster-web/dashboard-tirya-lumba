import { useState } from 'react';
import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import Modal from '../components/Modal';
import { SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { Button } from '../components/ui';
import { apiSend } from '../lib/api';
import { API_KEYS, fetchManagers } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';
import type { ServerPoolManager } from '../lib/api-types';

export default function Pengelola() {
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, loading: isLoading, reload } = useResource(API_KEYS.managers, fetchManagers);
  const rows = data ?? [];

  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  async function addManager(payload: { fullName: string; email: string; password: string; phone: string; locationId: string; isActive?: boolean }) {
    try {
      await apiSend<ServerPoolManager>('/pool-managers', 'POST', payload);
      await reload();
      toast.success('Pengelola ditambahkan.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menambahkan pengelola.', { style: { color: '#B3341F' } });
    }
  }

  async function updateManager(id: string, payload: Partial<ServerPoolManager>) {
    try {
      await apiSend<ServerPoolManager>(`/pool-managers/${id}`, 'PUT', payload);
      await reload();
      toast.success('Pengelola diperbarui.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui pengelola.', { style: { color: '#B3341F' } });
    }
  }

  async function deleteManager(id: string) {
    try {
      await apiSend<ServerPoolManager>(`/pool-managers/${id}`, 'DELETE');
      await reload();
      toast.success('Pengelola dihapus.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus pengelola.', { style: { color: '#B3341F' } });
    }
  }

  const crudRows = rows.map((r, i) => ({
    id: i + 1,
    serverId: r.id,
    nama: r.fullName,
    telp: r.phone ?? '-',
    lokasi: r.location?.name ?? '-',
  }));

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data pengelola">
        <SkeletonHeader action />
        <SkeletonTable rows={6} cols={4} />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <CrudPage
        title="Pengelola Kolam"
        subtitle="Kelola akun pengelola per lokasi"
        addLabel="Tambah"
        fields={[
          { key: 'fullName', label: 'Nama lengkap', required: true },
          { key: 'email', label: 'Email', required: true },
          { key: 'password', label: 'Password', type: 'text', required: true },
          { key: 'phone', label: 'No. telepon', type: 'tel', required: true },
          { key: 'locationId', label: 'Lokasi kolam renang', type: 'text', required: true },
        ]}
        columns={[
          { key: 'nama', header: 'Nama' },
          { key: 'telp', header: 'No. telepon' },
          { key: 'lokasi', header: 'Lokasi' },
        ]}
        rows={crudRows}
        initialOf={(id) => {
          const r = crudRows.find((x) => x.id === id);
          const server = rows.find((x) => x.id === r?.serverId);
          return { fullName: r?.nama ?? '', email: server?.email ?? '', password: '', phone: r?.telp ?? '', locationId: server?.locationId ?? '' };
        }}
        onAdd={(d) => void addManager({ fullName: d.fullName, email: d.email, password: d.password, phone: d.phone, locationId: d.locationId, isActive: true })}
        onEdit={(id, d) => {
          const r = crudRows.find((x) => x.id === id);
          void updateManager(r?.serverId ?? '', { fullName: d.fullName, phone: d.phone });
        }}
        onDelete={(id) => {
          const r = crudRows.find((x) => x.id === id);
          void deleteManager(r?.serverId ?? '');
        }}
        extraActions={(id) => {
          const row = crudRows.find((x) => x.id === id);
          return (
            <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(row?.serverId ?? '')}>
              Detail
            </Button>
          );
        }}
      />

      {detail ? (
        <Modal title="Detail pengelola" onClose={() => setDetailId(null)} footer={<Button variant="ghost" onClick={() => setDetailId(null)}>Tutup</Button>}>
          <div className="mb-3.5 flex items-center gap-3">
            <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
              {detail.fullName
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </span>
            <div>
              <b>{detail.fullName}</b>
              <p className="m-0 text-slate-500">{detail.email}</p>
            </div>
          </div>
          <dl className="mb-3.5 grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">No. telepon</dt>
            <dd className="m-0">{detail.phone ?? '-'}</dd>
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="m-0">{detail.location?.name ?? '-'}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="m-0">{detail.isActive ? 'Aktif' : 'Non-Aktif'}</dd>
            <dt className="text-slate-500">Terverifikasi</dt>
            <dd className="m-0">{detail.isVerified ? 'Ya' : 'Belum'}</dd>
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}
