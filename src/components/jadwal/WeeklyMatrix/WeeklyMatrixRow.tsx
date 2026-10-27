import { Check, CheckCheck } from 'lucide-react';
import { HARI } from '../../../lib/format';
import { slotKey } from '../session-templates';
import type { SessionTemplate } from '../session-templates';

interface WeeklyMatrixRowProps {
  template: SessionTemplate;
  existing: Set<string>;
  selected: Set<string>;
  saving: boolean;
  onToggle: (key: string) => void;
  onToggleRow: (template: SessionTemplate) => void;
}

export default function WeeklyMatrixRow({
  template,
  existing,
  selected,
  saving,
  onToggle,
  onToggleRow,
}: WeeklyMatrixRowProps) {
  const rowKeys = HARI.map((day) => slotKey(template.name, day));
  const editableKeys = rowKeys.filter((key) => !existing.has(key));
  const checkedCount = rowKeys.filter((key) => existing.has(key) || selected.has(key)).length;
  const allChecked = editableKeys.length > 0 && editableKeys.every((key) => selected.has(key));
  const canToggleRow = editableKeys.length > 0 && !saving;

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-3.5 align-middle">
        <b className="font-display block text-sm font-bold text-[#1D3557]">{template.name}</b>
        <span className="text-xs text-slate-400 tabular-nums">
          {template.startTime} – {template.endTime}
        </span>
        <button
          type="button"
          onClick={() => onToggleRow(template)}
          disabled={!canToggleRow}
          aria-pressed={allChecked}
          aria-label={`Pilih semua hari untuk sesi ${template.name}`}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#00B4D8] px-2.5 py-1 text-[11px] font-semibold text-[#0077B6] transition-colors hover:bg-[#E0FBFC] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-slate-300 disabled:hover:bg-transparent cursor-pointer"
        >
          <CheckCheck size={13} aria-hidden="true" />
          Semua hari
          <span className="rounded bg-[#E0FBFC] px-1.5 py-0.2 text-[10px] tabular-nums font-bold text-[#0077B6]">
            {checkedCount}/{HARI.length}
          </span>
        </button>
      </td>
      {HARI.map((day) => {
        const key = slotKey(template.name, day);
        const isSaved = existing.has(key);
        const isSelected = selected.has(key);

        return (
          <td key={day} className="px-2 py-3 text-center align-middle">
            {isSaved ? (
              <div
                title={`${template.name} (${day}) sudah tersimpan di database`}
                className="inline-flex flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-center cursor-not-allowed w-full max-w-[80px]"
              >
                <Check size={14} className="text-emerald-600 font-bold" />
                <span className="text-[10px] font-semibold text-emerald-700 leading-none mt-0.5">
                  Tersimpan
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onToggle(key)}
                disabled={saving}
                aria-pressed={isSelected}
                aria-label={`${template.name} hari ${day}`}
                className={`inline-flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-150 cursor-pointer w-full max-w-[80px] py-1.5 px-2 select-none ${
                  isSelected
                    ? 'border-[#0077B6] bg-[#E0FBFC] text-[#0077B6] font-bold shadow-2xs ring-2 ring-[#00B4D8]/30'
                    : 'border-gray-200 bg-white text-slate-400 hover:border-[#00B4D8] hover:text-[#0077B6] hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-sm border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#0077B6] bg-[#0077B6] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </div>
                <span className="text-[10px] font-medium leading-none mt-1">
                  {isSelected ? 'Dipilih' : 'Kosong'}
                </span>
              </button>
            )}
          </td>
        );
      })}
    </tr>
  );
}
