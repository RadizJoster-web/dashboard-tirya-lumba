import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button } from '../components/ui';
import { usePelatih } from '../lib/store';

export default function Pelatih() {
  const rows = usePelatih();
  const [loading, setLoading] = useState(true);
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Manajemen Pelatih</h2>
        <p className="text-slate-500">Profil, lokasi mengajar, dan riwayat</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data pelatih…</div>
      ) : (
        <DataTable headers={['Nama', 'Lokasi mengajar', 'Aksi']} isEmpty={rows.length === 0}>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-gray-200 last:border-0">
              <td className="px-3.5 py-2.5">{r.nama}</td>
              <td className="px-3.5 py-2.5">{r.lokasi}</td>
              <td className="px-3.5 py-2.5">
                <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(r.id)}>
                  Detail
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {detail ? (
        <Modal title="Detail pelatih" onClose={() => setDetailId(null)} footer={<Button variant="ghost" onClick={() => setDetailId(null)}>Tutup</Button>}>
          <dl className="mb-3.5 grid grid-cols-[110px_1fr] gap-2">
            <dt className="text-slate-500">Nama</dt>
            <dd className="m-0">{detail.nama}</dd>
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="m-0">{detail.lokasi}</dd>
            <dt className="text-slate-500">Lisensi</dt>
            <dd className="m-0">{detail.lisensi ?? 'Menunggu verifikasi berkas'}</dd>
            <dt className="text-slate-500">Jadwal</dt>
            <dd className="m-0">{detail.jadwal ?? '-'}</dd>
            <dt className="text-slate-500">Riwayat</dt>
            <dd className="m-0">{detail.riwayat ?? 'Baru bergabung'}</dd>
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}
