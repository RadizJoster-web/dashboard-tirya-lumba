import { Button } from '../../ui';
import type { ServerLocation } from '../../../lib/api/types';
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
    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="font-display m-0 text-base font-bold text-[#1D3557]">
            Matriks Jadwal Mingguan (Senin – Minggu)
          </h3>
          <p className="mt-0.5 mb-0 text-xs text-slate-500 font-normal">
            Pilih slot sesi untuk setiap hari yang akan diaktifkan di kolam renang terpilih.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Lokasi Kolam:
          </label>
          <select
            value={activeLocationId}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#1D3557] shadow-2xs focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 cursor-pointer"
          >
            <option value="">Pilih Lokasi Kolam</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {locations.length === 0 ? (
        <p className="mt-4 mb-0 rounded-xl bg-slate-50 border border-gray-100 p-4 text-xs text-slate-500 text-center">
          Belum ada lokasi terdaftar. Tambahkan lokasi terlebih dahulu di menu Lokasi.
        </p>
      ) : templates.length === 0 ? (
        <p className="mt-4 mb-0 rounded-xl bg-slate-50 border border-gray-100 p-4 text-xs text-slate-500 text-center">
          Tambahkan template sesi di atas untuk mulai memetakan matriks jadwal.
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3.5">
            <p className="m-0 text-xs text-slate-500">
              {locationName ? `Kolam Aktif: ${locationName}. ` : ''}Slot bertanda <strong>Tersimpan</strong> telah aktif di sistem.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {hasSaved && (
                <Button variant="ghost" size="sm" onClick={onOpenSaved}>
                  Lihat / Edit Sesi Tersimpan
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={onSubmit}
                disabled={saving || selected.size === 0}
              >
                {saving ? 'Menyimpan Jadwal…' : `Simpan ${selected.size} Slot Terpilih`}
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
