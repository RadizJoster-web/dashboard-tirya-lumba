import { Button } from '../../ui';
import type { ServerLocation } from '../../../lib/api/types';
import { inputClass } from '../session-templates';
import type { SessionTemplate } from '../session-templates';
import WeeklyMatrixTable from './WeeklyMatrixTable';

interface WeeklyMatrixProps {
  locations: ServerLocation[];
  activeLocationId: string;
  locationName: string;
  templates: SessionTemplate[];
  existing: Set<string>;
  selected: Set<string>;
  saving: boolean;
  onLocationChange: (id: string) => void;
  onToggle: (key: string) => void;
  onToggleRow: (template: SessionTemplate) => void;
  onOpenSaved: () => void;
  onSubmit: () => void;
}

export default function WeeklyMatrix({
  locations,
  activeLocationId,
  locationName,
  templates,
  existing,
  selected,
  saving,
  onLocationChange,
  onToggle,
  onToggleRow,
  onOpenSaved,
  onSubmit,
}: WeeklyMatrixProps) {
  const hasSaved = existing.size > 0;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-lg font-bold">Jadwal mingguan</h3>
          <p className="mt-1 mb-0 text-sm text-slate-500">Centang hari untuk setiap sesi yang akan dikirim.</p>
        </div>
        <label className="block min-w-[220px] font-semibold">
          Lokasi
          <select value={activeLocationId} onChange={(e) => onLocationChange(e.target.value)} className={inputClass}>
            <option value="">Pilih lokasi</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </label>
      </div>

      {locations.length === 0 ? (
        <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
          Belum ada lokasi terdaftar. Tambahkan lokasi terlebih dahulu.
        </p>
      ) : templates.length === 0 ? (
        <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
          Tambahkan sesi di atas untuk mulai menyusun jadwal.
        </p>
      ) : (
        <>
          <WeeklyMatrixTable
            templates={templates}
            existing={existing}
            selected={selected}
            saving={saving}
            onToggle={onToggle}
            onToggleRow={onToggleRow}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-sm text-slate-500">
              {locationName ? `Lokasi: ${locationName}. ` : ''}Sesi bertanda tersimpan tidak bisa dicentang ulang.
            </p>
            <div className="flex flex-wrap gap-2">
              {hasSaved ? (
                <Button variant="outline" onClick={onOpenSaved}>Edit jadwal</Button>
              ) : null}
              <Button onClick={onSubmit} disabled={saving}>
                {saving ? 'Mengirim…' : 'Kirim jadwal'}
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
