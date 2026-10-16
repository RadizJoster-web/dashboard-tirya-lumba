import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button, Field } from '../components/ui';
import { LOCATIONS } from '../lib/demo';
import { updateSiswa, useSiswa } from '../lib/store';
import type { SessionUser } from '../lib/auth';

const PAGE_SIZE = 6;

type ModalState = { kind: 'detail' | 'edit'; id: number } | null;

export default function Siswa({ user }: { user: SessionUser }) {
  const admin = user.role === 'admin';
  const rows = useSiswa();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const scoped = admin ? rows : rows.filter((r) => r.lokasi === user.lokasi);
    return scoped.filter(
      (r) =>
        r.nama.toLowerCase().includes(q.trim().toLowerCase()) &&
        (!status || (status === 'Aktif') === r.aktif) &&
        (!lokasi || r.lokasi === lokasi),
    );
  }, [rows, q, status, lokasi, admin, user.lokasi]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const active = modal ? rows.find((r) => r.id === modal.id) ?? null : null;

  function closeModal() {
    setModal(null);
  }

  function saveEdit(e: FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nama = String(fd.get('nama') ?? '').trim();
    const usia = Number(fd.get('usia'));
    const berlakuSd = String(fd.get('berlakuSd') ?? '');
    const paket = String(fd.get('paket') ?? '');
    const nextLokasi = admin ? String(fd.get('lokasi') ?? '') : (active?.lokasi ?? '');
    if (!nama || !Number.isFinite(usia) || !berlakuSd || !nextLokasi) return;
    if (paket !== 'Reguler' && paket !== 'Privat') return;
    updateSiswa(id, { nama, usia, berlakuSd, paket, lokasi: nextLokasi });
    closeModal();
  }

  function toggleActive(id: number) {
    const target = rows.find((r) => r.id === id);
    if (target) updateSiswa(id, { aktif: !target.aktif });
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Manajemen Siswa</h2>
        <p className="text-slate-500">{admin ? 'Seluruh cabang' : (user.lokasi ?? '')}</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <input
          placeholder="Cari nama siswa"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Cari nama siswa"
          className="min-w-[150px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter status"
          className="w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="">Semua status</option>
          <option value="Aktif">Aktif</option>
          <option value="Non-Aktif">Non-Aktif</option>
        </select>
        {admin ? (
          <select
            value={lokasi}
            onChange={(e) => {
              setLokasi(e.target.value);
              setPage(1);
            }}
            aria-label="Filter lokasi"
            className="w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            <option value="">Semua lokasi</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data siswa…</div>
      ) : (
        <>
          <DataTable headers={['Nama', 'Usia', 'Lokasi', 'Paket', 'Berlaku s/d', 'Status', 'Aksi']} isEmpty={pageRows.length === 0}>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-b border-gray-200 last:border-0">
                <td className="px-3.5 py-2.5">{r.nama}</td>
                <td className="px-3.5 py-2.5">{r.usia} thn</td>
                <td className="px-3.5 py-2.5">{r.lokasi}</td>
                <td className="px-3.5 py-2.5">{r.paket}</td>
                <td className="px-3.5 py-2.5">{r.berlakuSd}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.aktif ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFE4DF] text-[#B3341F]'}`}>
                    {r.aktif ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1.5">
                    <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'detail', id: r.id })}>
                      Detail
                    </Button>
                    <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'edit', id: r.id })}>
                      Edit
                    </Button>
                    <Button
                      variant={r.aktif ? 'danger' : 'outline'}
                      className="px-2.5 py-1 text-[13px]"
                      onClick={() => toggleActive(r.id)}
                    >
                      {r.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>

          <div className="mt-3 flex items-center justify-between text-slate-500">
            <span>{filtered.length} siswa</span>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage < 2} onClick={() => setPage(safePage - 1)}>
                Sebelumnya
              </Button>
              <span className="px-2 py-1">
                {safePage} / {totalPages}
              </span>
              <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                Berikutnya
              </Button>
            </div>
          </div>
        </>
      )}

      {modal && active ? (
        modal.kind === 'detail' ? (
          <Modal
            title="Detail siswa"
            onClose={closeModal}
            footer={
              <Button variant="ghost" onClick={closeModal}>
                Tutup
              </Button>
            }
          >
            <dl className="mb-3.5 grid grid-cols-[110px_1fr] gap-2">
              <dt className="text-slate-500">Nama</dt>
              <dd className="m-0">{active.nama}</dd>
              <dt className="text-slate-500">Usia</dt>
              <dd className="m-0">{active.usia} tahun</dd>
              <dt className="text-slate-500">Lokasi</dt>
              <dd className="m-0">{active.lokasi}</dd>
              <dt className="text-slate-500">Paket</dt>
              <dd className="m-0">{active.paket}</dd>
              <dt className="text-slate-500">Berlaku s/d</dt>
              <dd className="m-0">{active.berlakuSd}</dd>
              <dt className="text-slate-500">Status</dt>
              <dd className="m-0">{active.aktif ? 'Aktif' : 'Non-Aktif'}</dd>
            </dl>
          </Modal>
        ) : (
          <Modal title="Edit profil siswa" onClose={closeModal}>
            <form
              onSubmit={(e) => saveEdit(e, active.id)}
              className="grid gap-1"
            >
              <Field label="Nama" name="nama" defaultValue={active.nama} required />
              <Field label="Usia (tahun)" name="usia" type="number" min={3} max={80} defaultValue={String(active.usia)} required />
              {admin ? (
                <label className="mb-3 block font-semibold">
                  Lokasi
                  <select name="lokasi" defaultValue={active.lokasi} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium">
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <Field label="Berlaku s/d" name="berlakuSd" type="date" defaultValue={active.berlakuSd} required />
              <label className="mb-3 block font-semibold">
                Paket
                <select name="paket" defaultValue={active.paket} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium">
                  <option value="Reguler">Reguler</option>
                  <option value="Privat">Privat</option>
                </select>
              </label>
              <div className="mt-1.5 flex justify-end gap-2">
                <Button variant="ghost" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit">Simpan perubahan</Button>
              </div>
            </form>
          </Modal>
        )
      ) : null}
    </div>
  );
}
