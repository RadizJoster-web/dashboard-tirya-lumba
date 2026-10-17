import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button } from '../components/ui';
import { approveAntrean, rejectAntrean, useAntrean } from '../lib/store';
import type { SessionUser } from '../lib/auth';
import FormMurid from './registrasi/FormMurid';
import FormPelatih from './registrasi/FormPelatih';

type Tab = 'antrean' | 'murid' | 'pelatih';

export default function Pendaftaran({ user }: { user: SessionUser }) {
  const admin = user.role === 'admin';
  const antrean = useAntrean();
  const [tab, setTab] = useState<Tab>('antrean');
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectError, setRejectError] = useState('');
  const [tipeAntrean, setTipeAntrean] = useState<'Murid' | 'Pelatih'>('Murid');

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const tipe = admin ? tipeAntrean : 'Murid';
  const rows = antrean.filter(
    (a) => a.tipe === tipe && (!admin ? a.lokasi === user.lokasi : true),
  );
  const rejectTarget = rejectId !== null ? antrean.find((a) => a.id === rejectId) ?? null : null;

  function onApprove(id: number) {
    const item = approveAntrean(id);
    if (item)
      toast.success(`${item.nama} disetujui dan masuk data ${item.tipe === 'Murid' ? 'siswa' : 'pelatih'}.`);
  }

  function onReject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const alasan = String(new FormData(e.currentTarget).get('alasan') ?? '').trim();
    if (!alasan) {
      setRejectError('Alasan penolakan wajib diisi.');
      return;
    }
    const item = rejectId !== null ? rejectAntrean(rejectId) : null;
    setRejectId(null);
    setRejectError('');
    if (item) toast.error(`${item.nama} ditolak. Alasan: ${alasan}`, { style: { color: '#B3341F' } });
  }

  const tabLabel = (t: Tab) =>
    t === 'antrean' ? 'Antrean' : t === 'murid' ? 'Form Murid' : 'Form Pelatih';

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Pendaftaran dan Antrean</h2>
        <p className="text-slate-500">{admin ? 'Tinjau pendaftar yang menunggu persetujuan' : (user.lokasi ?? '')}</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        {(['antrean', 'murid', 'pelatih'] as Tab[]).map((t) => (
          <Button key={t} variant={tab === t ? 'primary' : 'ghost'} onClick={() => setTab(t)}>
            {tabLabel(t)}
          </Button>
        ))}
      </div>

      {tab === 'antrean' ? (
        <div>
          {admin ? (
            <div className="mb-3.5 flex flex-wrap gap-2.5">
              <Button variant={tipeAntrean === 'Murid' ? 'primary' : 'ghost'} onClick={() => setTipeAntrean('Murid')}>
                Murid
              </Button>
              <Button variant={tipeAntrean === 'Pelatih' ? 'primary' : 'ghost'} onClick={() => setTipeAntrean('Pelatih')}>
                Pelatih
              </Button>
            </div>
          ) : null}
          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat antrean…</div>
          ) : (
            <DataTable headers={['Nama', 'Lokasi', 'Tanggal daftar', 'Aksi']} isEmpty={rows.length === 0}>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-gray-200 last:border-0">
                  <td className="px-3.5 py-2.5">{a.nama}</td>
                  <td className="px-3.5 py-2.5">{a.lokasi}</td>
                  <td className="px-3.5 py-2.5">{a.tgl}</td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1.5">
                      <Button className="px-2.5 py-1 text-[13px]" onClick={() => onApprove(a.id)}>
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        className="px-2.5 py-1 text-[13px]"
                        onClick={() => {
                          setRejectId(a.id);
                          setRejectError('');
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      ) : tab === 'murid' ? (
        <FormMurid />
      ) : (
        <FormPelatih />
      )}

      {rejectTarget ? (
        <Modal title={`Tolak ${rejectTarget.nama}`} onClose={() => setRejectId(null)}>
          <form onSubmit={onReject} className="grid gap-1">
            <label className="mb-3 block font-semibold">
              Alasan penolakan
              <textarea
                name="alasan"
                rows={3}
                required
                placeholder="Contoh: berkas belum lengkap"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium"
              />
            </label>
            {rejectError ? <span className="mb-2 block text-[13px] font-medium text-[#B3341F]">{rejectError}</span> : null}
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRejectId(null)}>
                Batal
              </Button>
              <Button type="submit" variant="danger">
                Tolak
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
