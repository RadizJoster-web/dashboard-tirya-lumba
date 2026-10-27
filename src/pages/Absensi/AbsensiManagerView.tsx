import { useState } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import { Button, RoleTag } from '../../components/ui';

interface AbsensiPerson {
  peran: 'Murid' | 'Pelatih';
  nama: string;
  lokasi?: string;
  sesi?: string;
  status?: 'Hadir' | 'Tidak Hadir';
}

interface AbsensiManagerViewProps {
  lokasi: string;
  people: AbsensiPerson[];
  onSave: (
    draft: Record<string, 'Hadir' | 'Tidak Hadir'>,
  ) => Promise<boolean>;
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function AbsensiManagerView({
  lokasi,
  people,
  onSave,
}: AbsensiManagerViewProps) {
  const [draft, setDraft] = useState<Record<string, 'Hadir' | 'Tidak Hadir'>>({});
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const success = await onSave(draft);
    if (success) {
      setDraft({});
    }
    setSaving(false);
  }

  // Quick action: set all to 'Hadir'
  function markAll(status: 'Hadir' | 'Tidak Hadir') {
    const nextDraft: Record<string, 'Hadir' | 'Tidak Hadir'> = {};
    for (const p of people) {
      nextDraft[`${p.peran}|${p.nama}`] = status;
    }
    setDraft(nextDraft);
  }

  const columns: DataTableColumn<AbsensiPerson>[] = [
    {
      key: 'nama',
      header: 'Nama Peserta',
      width: '32%',
      primary: true,
      render: (p) => (
        <div>
          <span className="block font-semibold text-[#1D3557] text-sm truncate">
            {p.nama}
          </span>
          <span className="block text-xs text-slate-400 truncate">
            {p.lokasi || lokasi || 'Kolam Cabang'}
          </span>
        </div>
      ),
    },
    {
      key: 'peran',
      header: 'Peran',
      width: '16%',
      render: (p) => (
        <RoleTag role={p.peran === 'Pelatih' ? 'instructor' : 'student'}>
          {p.peran}
        </RoleTag>
      ),
    },
    {
      key: 'sesi',
      header: 'Sesi Jam Latihan',
      width: '24%',
      render: (p) => (
        <span className="text-xs font-semibold text-slate-600 tabular-nums">
          {p.sesi || 'Sesi Reguler'}
        </span>
      ),
    },
    {
      key: 'kehadiran',
      header: 'Status Presensi',
      width: '28%',
      render: (p) => {
        const key = `${p.peran}|${p.nama}`;
        const v = draft[key] ?? p.status ?? 'Tidak Hadir';
        const isHadir = v === 'Hadir';

        return (
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  [key]: 'Hadir',
                }))
              }
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-150 cursor-pointer ${
                isHadir
                  ? 'bg-[#DCFCE7] text-[#166534] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Hadir
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  [key]: 'Tidak Hadir',
                }))
              }
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-150 cursor-pointer ${
                !isHadir
                  ? 'bg-[#FFE4DF] text-[#C93B2B] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Tidak Hadir
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 rounded-xl border border-gray-200 shadow-2xs">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Jadwal Operasional Hari Ini
          </span>
          <h3 className="font-display text-base font-bold text-[#1D3557] mt-0.5">
            {todayFormatted()}
          </h3>
          <p className="text-xs text-slate-500">
            {lokasi ? `Cabang ${lokasi}` : 'Semua Kolam Cabang'} · {people.length} jadwal sesi terdaftar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {people.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 mr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAll('Hadir')}
                className="text-xs"
              >
                Semua Hadir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAll('Tidak Hadir')}
                className="text-xs"
              >
                Reset
              </Button>
            </div>
          )}

          <Button
            variant="primary"
            onClick={() => void handleSave()}
            disabled={saving || people.length === 0}
          >
            {saving ? 'Menyimpan Presensi…' : 'Simpan Presensi Hari Ini'}
          </Button>
        </div>
      </div>

      {/* Main Attendance Operational Table */}
      <DataTable
        columns={columns}
        rows={people}
        rowKey={(p, i) => `${p.peran}-${p.nama}-${i}`}
        emptyText="Tidak ada jadwal sesi latihan murid atau pelatih hari ini."
      />
    </div>
  );
}
