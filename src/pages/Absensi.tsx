import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import { Button } from '../components/ui';
import { LOCATIONS } from '../lib/demo';
import { pushAbsen, useAbsen, usePelatih, useSiswa } from '../lib/store';
import type { Absen } from '../lib/store';
import type { SessionUser } from '../lib/auth';

function todayId(): string {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Absensi({ user }: { user: SessionUser }) {
  const admin = user.role === 'admin';
  const absen = useAbsen();
  const siswa = useSiswa();
  const pelatih = usePelatih();
  const [loading, setLoading] = useState(true);
  const [fLokasi, setFLokasi] = useState('');
  const [fPeran, setFPeran] = useState('');
  const [draft, setDraft] = useState<Record<string, 'Hadir' | 'Tidak Hadir'>>({});
  const [tampilSemua, setTampilSemua] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  if (admin) {
    const allRows = absen.filter((a) => (!fLokasi || a.lokasi === fLokasi) && (!fPeran || a.peran === fPeran));
    const rows = tampilSemua ? allRows : allRows.slice(0, 50);
    const selectClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-2xl leading-8 font-bold">Riwayat Absensi</h2>
          <p className="text-slate-500">Mode lihat saja</p>
        </div>
        <div className="mb-3.5 flex flex-wrap gap-2.5">
          <select value={fLokasi} onChange={(e) => setFLokasi(e.target.value)} aria-label="Filter lokasi" className={selectClass}>
            <option value="">Semua lokasi</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select value={fPeran} onChange={(e) => setFPeran(e.target.value)} aria-label="Filter peran" className={selectClass}>
            <option value="">Murid dan pelatih</option>
            <option value="Murid">Murid</option>
            <option value="Pelatih">Pelatih</option>
          </select>
        </div>
        {loading ? (
          <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat riwayat…</div>
        ) : (
          <DataTable headers={['Tanggal', 'Nama', 'Peran', 'Lokasi', 'Status']} isEmpty={rows.length === 0}>
            {rows.map((a, i) => (
              <tr key={`${a.tgl}-${a.nama}-${i}`} className="border-b border-gray-200 last:border-0">
                <td className="px-3.5 py-2.5">{a.tgl}</td>
                <td className="px-3.5 py-2.5">{a.nama}</td>
                <td className="px-3.5 py-2.5">{a.peran}</td>
                <td className="px-3.5 py-2.5">{a.lokasi}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.st === 'Hadir' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFE4DF] text-[#B3341F]'}`}>
                    {a.st}
                  </span>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
        {!tampilSemua && allRows.length > 50 ? (
          <div className="mt-2.5 text-center">
            <Button variant="ghost" className="px-3 py-1 text-[13px]" onClick={() => setTampilSemua(true)}>
              Tampilkan semua ({allRows.length})
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  const lokasi = user.lokasi ?? '';
  const people: Array<{ peran: 'Murid' | 'Pelatih'; nama: string }> = [
    ...pelatih.filter((p) => p.lokasi === lokasi).map((p) => ({ peran: 'Pelatih' as const, nama: p.nama })),
    ...siswa
      .filter((s) => s.lokasi === lokasi && s.aktif)
      .slice(0, 6)
      .map((s) => ({ peran: 'Murid' as const, nama: s.nama })),
  ];

  function save() {
    const rows: Absen[] = people.map((p) => ({
      tgl: todayIso(),
      nama: p.nama,
      peran: p.peran,
      lokasi,
      st: draft[`${p.peran}|${p.nama}`] ?? 'Tidak Hadir',
    }));
    pushAbsen(rows);
    setDraft({});
    toast.success('Absensi hari ini tersimpan.');
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Absensi Hari Ini</h2>
          <p className="text-slate-500">{lokasi} · {todayId()}</p>
        </div>
        <Button onClick={save}>Simpan absensi</Button>
      </div>
      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat daftar hadir…</div>
      ) : (
        <DataTable headers={['Nama', 'Peran', 'Kehadiran']} isEmpty={people.length === 0}>
          {people.map((p) => {
            const key = `${p.peran}|${p.nama}`;
            const v = draft[key] ?? 'Tidak Hadir';
            return (
              <tr key={key} className="border-b border-gray-200 last:border-0">
                <td className="px-3.5 py-2.5">{p.nama}</td>
                <td className="px-3.5 py-2.5">{p.peran}</td>
                <td className="px-3.5 py-2.5">
                  <select
                    value={v}
                    onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value as 'Hadir' | 'Tidak Hadir' }))}
                    aria-label={`Kehadiran ${p.nama}`}
                    style={{ width: '150px', borderColor: v === 'Hadir' ? '#16A34A' : '#B3341F' }}
                    className="rounded-lg border bg-white px-3 py-2"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </div>
  );
}
