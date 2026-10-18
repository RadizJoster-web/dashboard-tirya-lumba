import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CrudPage from '../components/CrudPage';
import Modal from '../components/Modal';
import { Button } from '../components/ui';
import { apiGet, apiSend } from '../lib/api';
import type { ServerPoolManager } from '../lib/api-types';

export default function Pengelola() {
  const queryClient = useQueryClient();
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['pengelola'],
    queryFn: () => apiGet<ServerPoolManager[]>('/pool-managers'),
  });

  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  const addMutation = useMutation({
    mutationFn: (payload: { fullName: string; email: string; password: string; phone: string; locationId: string; isActive?: boolean }) =>
      apiSend<ServerPoolManager>('/pool-managers', 'POST', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengelola'] });
      toast.success('Pengelola ditambahkan.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menambahkan pengelola.', { style: { color: '#B3341F' } }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ServerPoolManager> }) =>
      apiSend<ServerPoolManager>(`/pool-managers/${id}`, 'PUT', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengelola'] });
      toast.success('Pengelola diperbarui.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal memperbarui pengelola.', { style: { color: '#B3341F' } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiSend<ServerPoolManager>(`/pool-managers/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengelola'] });
      toast.success('Pengelola dihapus.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menghapus pengelola.', { style: { color: '#B3341F' } }),
  });

  const crudRows = rows.map((r, i) => ({
    id: i + 1,
    serverId: r.id,
    nama: r.fullName,
    telp: r.phone ?? '-',
    lokasi: r.location?.name ?? '-',
  }));

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data pengelola…</div>
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
        onAdd={(d) => addMutation.mutate({ fullName: d.fullName, email: d.email, password: d.password, phone: d.phone, locationId: d.locationId, isActive: true })}
        onEdit={(id, d) => {
          const r = crudRows.find((x) => x.id === id);
          updateMutation.mutate({ id: r?.serverId ?? '', payload: { fullName: d.fullName, phone: d.phone } });
        }}
        onDelete={(id) => {
          const r = crudRows.find((x) => x.id === id);
          deleteMutation.mutate(r?.serverId ?? '');
        }}
        extraActions={(id) => (
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(String(id))}>
            Detail
          </Button>
        )}
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
