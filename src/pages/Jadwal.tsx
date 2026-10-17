import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button, Field } from '../components/ui';
import { HARI, LOCATIONS, SESI_NAMES } from '../lib/demo';
import { addSesi, deleteSesi, resolveResched, updateSesi, usePelatih, useResched, useSesi } from '../lib/store';
import type { Sesi } from '../lib/store';

type SesiModal = { kind: 'add' } | { kind: 'edit'; id: number } | { kind: 'delete'; id: number } | null;

function readSesiForm(form: HTMLFormElement): Omit<Sesi, 'id'> | null {
  const fd = new FormData(form);
  const lokasi = String(fd.get('lokasi') ?? '');
  const hari = String(fd.get('hari') ?? '');
  const sesi = String(fd.get('sesi') ?? '');
  const jam = String(fd.get('jam') ?? '');
  const pelatih = String(fd.get('pelatih') ?? '');
  if (!lokasi || !hari || !sesi || !jam || !pelatih) return null;
  return { lokasi, hari, sesi, jam, pelatih };
}

export default function Jadwal() {
  const sesi = useSesi();
  const pelatih = usePelatih();
  const resched = useResched();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<SesiModal>(null);
  const [fHari, setFHari] = useState('');
  const [fLokasi, setFLokasi] = useState('');
  const [fSesi, setFSesi] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const coachNames = pelatih.map((p) => p.nama);
  const editing = modal && modal.kind === 'edit' ? sesi.find((s) => s.id === modal.id) ?? null : null;
  const deleting = modal && modal.kind === 'delete' ? sesi.find((s) => s.id === modal.id) ?? null : null;
  const available = sesi.filter(
    (s) => (!fHari || s.hari === fHari) && (!fLokasi || s.lokasi === fLokasi) && (!fSesi || s.sesi === fSesi),
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = readSesiForm(e.currentTarget);
    if (!parsed) return;
    if (modal && modal.kind === 'edit') {
      updateSesi(modal.id, parsed);
      toast.success('Sesi diperbarui.');
    } else {
      addSesi(parsed);
      toast.success('Sesi ditambahkan.');
    }
    setModal(null);
  }

  const selectClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';
  const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Jadwal dan Sesi</h2>
          <p className="text-slate-500">Kelola sesi pertemuan dan permintaan reschedule</p>
        </div>
        <Button onClick={() => setModal({ kind: 'add' })}>+ Tambah sesi</Button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat jadwal…</div>
      ) : (
        <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[1100px]:[grid-template-columns:1fr_300px]">
          <div className="grid gap-3.5">
            <DataTable headers={['Lokasi', 'Hari', 'Sesi', 'Jam', 'Pelatih', 'Aksi']} isEmpty={sesi.length === 0}>
              {sesi.map((s) => (
                <tr key={s.id} className="border-b border-gray-200 last:border-0">
                  <td className="px-3.5 py-2.5">{s.lokasi}</td>
                  <td className="px-3.5 py-2.5">{s.hari}</td>
                  <td className="px-3.5 py-2.5">{s.sesi}</td>
                  <td className="px-3.5 py-2.5">{s.jam}</td>
                  <td className="px-3.5 py-2.5">{s.pelatih}</td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1.5">
                      <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'edit', id: s.id })}>
                        Edit
                      </Button>
                      <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'delete', id: s.id })}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-2.5 text-base">Analitik ketersediaan pelatih</h3>
              <div className="mb-3.5 flex flex-wrap gap-2.5">
                <select value={fHari} onChange={(e) => setFHari(e.target.value)} aria-label="Filter hari" className={filterClass}>
                  <option value="">Semua hari</option>
                  {HARI.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select value={fLokasi} onChange={(e) => setFLokasi(e.target.value)} aria-label="Filter lokasi" className={filterClass}>
                  <option value="">Semua lokasi</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <select value={fSesi} onChange={(e) => setFSesi(e.target.value)} aria-label="Filter sesi" className={filterClass}>
                  <option value="">Semua sesi</option>
                  {SESI_NAMES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <DataTable headers={['Pelatih', 'Hari', 'Sesi', 'Lokasi']} isEmpty={available.length === 0}>
                {available.map((s) => (
                  <tr key={s.id} className="border-b border-gray-200 last:border-0">
                    <td className="px-3.5 py-2.5">{s.pelatih}</td>
                    <td className="px-3.5 py-2.5">{s.hari}</td>
                    <td className="px-3.5 py-2.5">{s.sesi} ({s.jam})</td>
                    <td className="px-3.5 py-2.5">{s.lokasi}</td>
                  </tr>
                ))}
              </DataTable>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-base">Request reschedule</h3>
            {resched.length === 0 ? (
              <p className="p-7 text-center text-slate-500">Tidak ada permintaan.</p>
            ) : (
              resched.map((r) => {
                const s = sesi.find((x) => x.id === r.sesiId);
                return (
                  <div key={r.id} className="border-b border-gray-200 py-3 last:border-0">
                    <b>{r.pelatih}</b>
                    <p className="my-1 text-slate-500">
                      {s ? `${s.hari} ${s.jam}` : 'Sesi dihapus'} menuju {r.hari} {r.jam}
                      <br />
                      {r.alasan}
                    </p>
                    <div className="flex gap-1.5">
                      <Button
                        className="px-2.5 py-1 text-[13px]"
                        onClick={() => {
                          resolveResched(r.id, true);
                          toast.success('Jadwal dipindahkan.');
                        }}
                      >
                        Setujui
                      </Button>
                      <Button
                        variant="danger"
                        className="px-2.5 py-1 text-[13px]"
                        onClick={() => {
                          resolveResched(r.id, false);
                          toast.error('Permintaan ditolak.', {
                            style: { color: '#B3341F' },
                          });
                        }}
                      >
                        Tolak
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {modal && (modal.kind === 'add' || editing) ? (
        <Modal title={modal.kind === 'add' ? 'Tambah sesi' : 'Edit sesi'} onClose={() => setModal(null)}>
          <form onSubmit={onSubmit} className="grid gap-1">
            <label className="mb-3 block font-semibold">
              Lokasi
              <select name="lokasi" defaultValue={editing?.lokasi ?? LOCATIONS[0]} className={selectClass}>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>
            <label className="mb-3 block font-semibold">
              Hari
              <select name="hari" defaultValue={editing?.hari ?? HARI[0]} className={selectClass}>
                {HARI.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </label>
            <label className="mb-3 block font-semibold">
              Sesi
              <select name="sesi" defaultValue={editing?.sesi ?? SESI_NAMES[0]} className={selectClass}>
                {SESI_NAMES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <Field label="Jam mulai" name="jam" type="time" defaultValue={editing?.jam ?? '09:00'} required />
            <label className="mb-3 block font-semibold">
              Pelatih
              <select name="pelatih" defaultValue={editing?.pelatih ?? coachNames[0]} className={selectClass}>
                {coachNames.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModal(null)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal
          title="Hapus sesi?"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteSesi(deleting.id);
                  setModal(null);
                  toast.success('Sesi dihapus.');
                }}
              >
                Hapus
              </Button>
            </>
          }
        >
          <p className="mb-3.5">Data yang dihapus tidak bisa dikembalikan.</p>
        </Modal>
      ) : null}
    </div>
  );
}
