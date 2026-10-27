import { useMemo, useState } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button, RoleTag } from '../../components/ui';
import type { ServerAbsen } from '../../lib/api/types';

interface AbsensiAdminViewProps {
  locations: string[];
  absen: ServerAbsen[];
}

const pillSelectClass =
  'appearance-none rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all cursor-pointer';

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

  const columns: DataTableColumn<ServerAbsen>[] = [
    {
      key: 'tgl',
      header: 'Tanggal',
      width: '20%',
      primary: true,
      render: (a) => (
        <span className="font-semibold text-[#1D3557] tabular-nums">
          {a.tgl}
        </span>
      ),
    },
    {
      key: 'nama',
      header: 'Nama Peserta',
      width: '28%',
      render: (a) => (
        <span className="font-medium text-[#1D3557] truncate block">
          {a.nama}
        </span>
      ),
    },
    {
      key: 'peran',
      header: 'Peran',
      width: '16%',
      render: (a) => (
        <RoleTag role={a.peran === 'Pelatih' ? 'instructor' : 'student'}>
          {a.peran}
        </RoleTag>
      ),
    },
    {
      key: 'lokasi',
      header: 'Lokasi Kolam',
      width: '20%',
      render: (a) => (
        <span className="text-xs text-slate-600 truncate block">
          {a.lokasi || '-'}
        </span>
      ),
    },
    {
      key: 'st',
      header: 'Status Kehadiran',
      width: '16%',
      render: (a) => <StatusBadge status={a.st} />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={fLokasi}
            onChange={(e) => {
              setFLokasi(e.target.value);
              setTampilSemua(false);
            }}
            aria-label="Filter lokasi"
            className={pillSelectClass}
          >
            <option value="">Semua Lokasi Kolam</option>
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
            className={pillSelectClass}
          >
            <option value="">Semua Peran (Murid & Pelatih)</option>
            <option value="Murid">Murid</option>
            <option value="Pelatih">Pelatih</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 tabular-nums">
          Ditemukan <strong className="text-[#1D3557] font-semibold">{allRows.length}</strong> catatan riwayat
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(a, i) => `${a.tgl}-${a.nama}-${i}`}
        emptyText="Belum ada riwayat absensi yang cocok dengan filter."
      />

      {!tampilSemua && allRows.length > 50 && (
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTampilSemua(true)}
            className="rounded-full px-5 py-2 text-xs"
          >
            Tampilkan Semua ({allRows.length} Data)
          </Button>
        </div>
      )}
    </div>
  );
}
