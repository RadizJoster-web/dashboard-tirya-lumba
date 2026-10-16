import { useState } from 'react';
import CrudPage from '../components/CrudPage';
import Modal from '../components/Modal';
import { Button } from '../components/ui';
import { LOCATIONS } from '../lib/demo';
import { addPengelola, deletePengelola, updatePengelola, usePengelola } from '../lib/store';

function initials(nama: string): string {
  return nama
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Pengelola() {
  const rows = usePengelola();
  const [detailId, setDetailId] = useState<number | null>(null);
  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  return (
    <div>
      <CrudPage
        title="Pengelola Kolam"
        subtitle="Kelola akun pengelola per lokasi"
        addLabel="Tambah"
        fields={[
          { key: 'nama', label: 'Nama lengkap' },
          { key: 'telp', label: 'No. telepon', type: 'tel' },
          { key: 'lokasi', label: 'Lokasi kolam renang', type: 'select', options: LOCATIONS },
          { key: 'foto', label: 'Foto profil', type: 'file', required: false },
        ]}
        columns={[
          { key: 'nama', header: 'Nama' },
          { key: 'telp', header: 'No. telepon' },
          { key: 'lokasi', header: 'Lokasi' },
          { key: 'foto', header: 'Foto' },
        ]}
        rows={rows}
        initialOf={(id) => {
          const r = rows.find((x) => x.id === id);
          return { nama: r?.nama ?? '', telp: r?.telp ?? '', lokasi: r?.lokasi ?? LOCATIONS[0] };
        }}
        onAdd={(d, files) =>
          addPengelola({ nama: d.nama, telp: d.telp, lokasi: d.lokasi, foto: files.foto?.name ?? '', fotoUrl: files.foto?.url })
        }
        onEdit={(id, d, files) => {
          const prev = rows.find((x) => x.id === id);
          updatePengelola(id, {
            nama: d.nama,
            telp: d.telp,
            lokasi: d.lokasi,
            foto: files.foto?.name ?? prev?.foto ?? '',
            fotoUrl: files.foto?.url ?? prev?.fotoUrl,
          });
        }}
        onDelete={deletePengelola}
        extraActions={(id) => (
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(id)}>
            Detail
          </Button>
        )}
      />

      {detail ? (
        <Modal title="Detail pengelola" onClose={() => setDetailId(null)} footer={<Button variant="ghost" onClick={() => setDetailId(null)}>Tutup</Button>}>
          <div className="mb-3.5 flex items-center gap-3">
            {detail.fotoUrl ? (
              <img src={detail.fotoUrl} alt={`Foto ${detail.nama}`} className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
                {initials(detail.nama)}
              </span>
            )}
            <div>
              <b>{detail.nama}</b>
              <p className="m-0 text-slate-500">{detail.foto || 'Belum ada foto'}</p>
            </div>
          </div>
          <dl className="mb-3.5 grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">No. telepon</dt>
            <dd className="m-0">{detail.telp}</dd>
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="m-0">{detail.lokasi}</dd>
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}
