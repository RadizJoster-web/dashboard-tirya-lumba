import { useState } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/ui/DataTable';
import { AbsensiLoading } from '../components/loading';
import { Button } from '../components/ui';
import { apiSendAbsensi } from '../lib/api/client';
import { API_KEYS, fetchAttendance, fetchInstructors, fetchLocations, fetchStudents } from '../lib/api/resources';
import { useResource } from '../lib/api/cache';
import type { AbsenPayload } from '../lib/api/types';
import { useAuth } from '../lib/auth-context';

function todayId(): string {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Absensi() {
  const { user } = useAuth();
  const admin = user!.role === 'admin';
  const [fLokasi, setFLokasi] = useState('');
  const [fPeran, setFPeran] = useState('');
  const [draft, setDraft] = useState<Record<string, 'Hadir' | 'Tidak Hadir'>>({});
  const [tampilSemua, setTampilSemua] = useState(false);

  const { data: history, loading: historyLoading, reload } = useResource(API_KEYS.attendance, fetchAttendance);
  const { data: studentData, loading: studentsLoading } = useResource(API_KEYS.students, fetchStudents);
  const { data: instructorData, loading: instructorsLoading } = useResource(API_KEYS.instructors, fetchInstructors);
  const { data: locationData } = useResource(API_KEYS.locations, fetchLocations);

  const absen = history ?? [];
  const siswa = studentData ?? [];
  const pelatih = instructorData ?? [];
  const locations = (locationData ?? []).map((l) => l.name);

  if (historyLoading || studentsLoading || instructorsLoading) {
    return <AbsensiLoading admin={admin} />;
  }

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
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <select value={fPeran} onChange={(e) => setFPeran(e.target.value)} aria-label="Filter peran" className={selectClass}>
            <option value="">Murid dan pelatih</option>
            <option value="Murid">Murid</option>
            <option value="Pelatih">Pelatih</option>
          </select>
        </div>
        <DataTable
          columns={[
            { key: 'tgl', header: 'Tanggal', width: '20%', primary: true },
            { key: 'nama', header: 'Nama', width: '28%' },
            { key: 'peran', header: 'Peran', width: '14%' },
            { key: 'lokasi', header: 'Lokasi', width: '22%' },
            {
              key: 'st',
              header: 'Status',
              width: '16%',
              render: (a) => (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.st === 'Hadir' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FFE4DF] text-[#B3341F]'}`}>
                  {a.st}
                </span>
              ),
            },
          ]}
          rows={rows}
          rowKey={(a, i) => `${a.tgl}-${a.nama}-${i}`}
          emptyText="Belum ada riwayat absensi yang cocok."
        />
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

  const lokasi = user!.lokasi ?? '';
  const people: Array<{ peran: 'Murid' | 'Pelatih'; nama: string }> = [
    ...pelatih.filter((p) => p.isActive).map((p) => ({ peran: 'Pelatih' as const, nama: p.fullName })),
    ...siswa
      .filter((s) => s.lokasi === lokasi && s.aktif)
      .slice(0, 6)
      .map((s) => ({ peran: 'Murid' as const, nama: s.nama })),
  ];

  async function save() {
    const rows: AbsenPayload[] = people.map((p) => ({
      tgl: todayIso(),
      nama: p.nama,
      peran: p.peran,
      lokasi,
      st: draft[`${p.peran}|${p.nama}`] ?? 'Tidak Hadir',
    }));
    try {
      await apiSendAbsensi(API_KEYS.attendance, rows);
      await reload();
      setDraft({});
      toast.success('Absensi hari ini tersimpan.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan absensi.');
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Absensi Hari Ini</h2>
          <p className="text-slate-500">{lokasi} · {todayId()}</p>
        </div>
        <Button onClick={() => void save()}>Simpan absensi</Button>
      </div>
      <DataTable
        columns={[
          { key: 'nama', header: 'Nama', width: '40%', primary: true },
          { key: 'peran', header: 'Peran', width: '24%' },
          {
            key: 'kehadiran',
            header: 'Kehadiran',
            width: '36%',
            render: (p) => {
              const key = `${p.peran}|${p.nama}`;
              const v = draft[key] ?? 'Tidak Hadir';
              return (
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
              );
            },
          },
        ]}
        rows={people}
        rowKey={(p) => `${p.peran}|${p.nama}`}
        emptyText="Belum ada murid atau pelatih di lokasi ini."
      />
    </div>
  );
}
