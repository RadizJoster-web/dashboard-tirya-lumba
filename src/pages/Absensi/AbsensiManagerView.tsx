import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import { Button } from '../../components/ui';

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

function todayId(): string {
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
  const [draft, setDraft] = useState<Record<string, 'Hadir' | 'Tidak Hadir'>>(
    {},
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const success = await onSave(draft);
    if (success) {
      setDraft({});
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Absensi Hari Ini</h2>
          <p className="text-slate-500">
            {lokasi || 'Seluruh Kolam'} · {todayId()}
          </p>
        </div>
        <Button onClick={() => void handleSave()} disabled={saving || people.length === 0}>
          {saving ? 'Menyimpan…' : 'Simpan absensi'}
        </Button>
      </div>

      <DataTable
        columns={[
          { key: 'nama', header: 'Nama', width: '35%', primary: true },
          {
            key: 'peran',
            header: 'Peran',
            width: '20%',
            render: (p) => (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  p.peran === 'Pelatih'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {p.peran}
              </span>
            ),
          },
          {
            key: 'sesi',
            header: 'Sesi Latihan',
            width: '20%',
            render: (p) => p.sesi || '-',
          },
          {
            key: 'kehadiran',
            header: 'Kehadiran',
            width: '25%',
            render: (p) => {
              const key = `${p.peran}|${p.nama}`;
              const v = draft[key] ?? p.status ?? 'Tidak Hadir';
              return (
                <select
                  value={v}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      [key]: e.target.value as 'Hadir' | 'Tidak Hadir',
                    }))
                  }
                  aria-label={`Kehadiran ${p.nama}`}
                  style={{
                    width: '140px',
                    borderColor: v === 'Hadir' ? '#16A34A' : '#B3341F',
                  }}
                  className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="Hadir">✓ Hadir</option>
                  <option value="Tidak Hadir">✕ Tidak Hadir</option>
                </select>
              );
            },
          },
        ]}
        rows={people}
        rowKey={(p) => `${p.peran}|${p.nama}`}
        emptyText="Tidak ada jadwal murid atau pelatih hari ini di lokasi ini."
      />
    </div>
  );
}
