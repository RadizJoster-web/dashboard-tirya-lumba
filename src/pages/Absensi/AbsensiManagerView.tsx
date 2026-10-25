import { useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import { Button } from '../../components/ui';

interface AbsensiPerson {
  peran: 'Murid' | 'Pelatih';
  nama: string;
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
            {lokasi} · {todayId()}
          </p>
        </div>
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Menyimpan…' : 'Simpan absensi'}
        </Button>
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
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      [key]: e.target.value as 'Hadir' | 'Tidak Hadir',
                    }))
                  }
                  aria-label={`Kehadiran ${p.nama}`}
                  style={{
                    width: '150px',
                    borderColor: v === 'Hadir' ? '#16A34A' : '#B3341F',
                  }}
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
