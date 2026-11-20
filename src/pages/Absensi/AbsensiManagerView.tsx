import { useState } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import { RoleTag } from '../../components/ui';
import { AbsensiToolbar } from './AbsensiToolbar';

export interface AbsensiPerson {
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
              onClick={() => setDraft((prev) => ({ ...prev, [key]: 'Hadir' }))}
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
              onClick={() => setDraft((prev) => ({ ...prev, [key]: 'Tidak Hadir' }))}
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
      <AbsensiToolbar
        lokasi={lokasi}
        totalPeople={people.length}
        saving={saving}
        onMarkAll={markAll}
        onSave={() => void handleSave()}
      />

      <DataTable
        columns={columns}
        rows={people}
        rowKey={(p, i) => `${p.peran}-${p.nama}-${i}`}
        emptyText="Tidak ada jadwal sesi latihan murid atau pelatih hari ini."
      />
    </div>
  );
}
