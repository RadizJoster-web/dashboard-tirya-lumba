import { useMemo, useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import { Button } from '../../components/ui';
import type { ServerAbsen } from '../../lib/api/types';

interface AbsensiAdminViewProps {
  locations: string[];
  absen: ServerAbsen[];
}

const selectClass =
  'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

export default function AbsensiAdminView({
  locations,
  absen,
}: AbsensiAdminViewProps) {
  const [fLokasi, setFLokasi] = useState('');
  const [fPeran, setFPeran] = useState('');
  const [tampilSemua, setTampilSemua] = useState(false);

  const allRows = useMemo(
    () =>
      absen.filter(
        (a) =>
          (!fLokasi || a.lokasi === fLokasi) &&
          (!fPeran || a.peran === fPeran),
      ),
    [absen, fLokasi, fPeran],
  );

  const rows = tampilSemua ? allRows : allRows.slice(0, 50);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Riwayat Absensi</h2>
        <p className="text-slate-500">Mode lihat saja</p>
      </div>
      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <select
          value={fLokasi}
          onChange={(e) => {
            setFLokasi(e.target.value);
            setTampilSemua(false);
          }}
          aria-label="Filter lokasi"
          className={selectClass}
        >
          <option value="">Semua lokasi</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={fPeran}
          onChange={(e) => {
            setFPeran(e.target.value);
            setTampilSemua(false);
          }}
          aria-label="Filter peran"
          className={selectClass}
        >
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
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  a.st === 'Hadir'
                    ? 'bg-[#DCFCE7] text-[#166534]'
                    : 'bg-[#FFE4DF] text-[#B3341F]'
                }`}
              >
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
          <Button
            variant="ghost"
            className="px-3 py-1 text-[13px]"
            onClick={() => setTampilSemua(true)}
          >
            Tampilkan semua ({allRows.length})
          </Button>
        </div>
      ) : null}
    </div>
  );
}
