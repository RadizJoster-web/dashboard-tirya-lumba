import { CheckCheck } from 'lucide-react';
import { Button } from '../ui';
import { HARI } from '../../lib/format';
import type { ServerLocation } from '../../lib/api/types';
import { DAY_SHORT, inputClass, slotKey } from './session-templates';
import type { SessionTemplate } from './session-templates';

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
          <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[720px] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: '210px' }} />
                {HARI.map((day) => (
                  <col key={day} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" className="border-b border-gray-200 bg-basedash px-3 py-2.5 text-left font-semibold text-slate-500">
                    Sesi
                  </th>
                  {HARI.map((day, index) => (
                    <th key={day} scope="col" title={day} className="border-b border-gray-200 bg-basedash px-3 py-2.5 text-center font-semibold text-slate-500">
                      {DAY_SHORT[index]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => {
                  const rowKeys = HARI.map((day) => slotKey(template.name, day));
                  const editableKeys = rowKeys.filter((key) => !existing.has(key));
                  const checkedCount = rowKeys.filter((key) => existing.has(key) || selected.has(key)).length;
                  const allChecked = editableKeys.length > 0 && editableKeys.every((key) => selected.has(key));
                  const canToggleRow = editableKeys.length > 0 && !saving;

                  return (
                    <tr key={template.id} className="border-b border-gray-200 last:border-0">
                      <td className="px-3 py-2.5 align-top">
                        <b className="block">{template.name}</b>
                        <span className="text-xs text-slate-500">{template.startTime} - {template.endTime}</span>
                        <button
                          type="button"
                          onClick={() => onToggleRow(template)}
                          disabled={!canToggleRow}
                          aria-pressed={allChecked}
                          aria-label={`Centang semua hari untuk sesi ${template.name}, ${checkedCount} dari ${HARI.length} hari tercentang`}
                          className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-aqua px-2 text-[12px] font-semibold text-[#005f8f] transition-colors hover:bg-azure disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-slate-400 disabled:hover:bg-transparent"
                        >
                          <CheckCheck size={14} aria-hidden="true" />
                          Semua hari
                          <span className="rounded bg-azure px-1.5 py-0.5 text-[11px] tabular-nums text-[#005f8f]">
                            {checkedCount}/{HARI.length}
                          </span>
                        </button>
                      </td>
                      {HARI.map((day) => {
                        const key = slotKey(template.name, day);
                        const saved = existing.has(key);
                        return (
                          <td key={day} className="px-3 py-2.5 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={saved || selected.has(key)}
                              disabled={saved || saving}
                              onChange={() => onToggle(key)}
                              aria-label={`${template.name} hari ${day}`}
                              className="h-5 w-5 accent-primary"
                            />
                            {saved ? <span className="mt-0.5 block text-[11px] text-slate-500">tersimpan</span> : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
