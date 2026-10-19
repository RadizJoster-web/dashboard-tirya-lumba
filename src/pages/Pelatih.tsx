import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { Button } from '../components/ui';
import { API_KEYS, fetchInstructors } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';

export default function Pelatih() {
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, loading: isLoading } = useResource(API_KEYS.instructors, fetchInstructors);
  const rows = data ?? [];

  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data pelatih">
        <SkeletonHeader />
        <SkeletonTable rows={6} cols={3} />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Manajemen Pelatih</h2>
        <p className="text-slate-500">Profil, lokasi mengajar, dan riwayat</p>
      </div>

      <DataTable headers={['Nama', 'Status', 'Aksi']} isEmpty={rows.length === 0}>
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-gray-200 last:border-0">
            <td className="px-3.5 py-2.5">{r.fullName}</td>
            <td className="px-3.5 py-2.5">{r.isActive ? 'Aktif' : 'Non-Aktif'}</td>
            <td className="px-3.5 py-2.5">
              <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(r.id)}>
                Detail
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>

      {detail ? (
        <Modal title="Detail pelatih" onClose={() => setDetailId(null)} footer={<Button variant="ghost" onClick={() => setDetailId(null)}>Tutup</Button>}>
          <dl className="mb-3.5 grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">Nama</dt>
            <dd className="m-0">{detail.fullName}</dd>
            <dt className="text-slate-500">Telepon</dt>
            <dd className="m-0">{detail.phone ?? '-'}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="m-0">{detail.isActive ? 'Aktif' : 'Non-Aktif'}</dd>
            <dt className="text-slate-500">Foto profil</dt>
            <dd className="m-0">{detail.profilePictureUrl ?? 'Belum ada foto'}</dd>
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}
