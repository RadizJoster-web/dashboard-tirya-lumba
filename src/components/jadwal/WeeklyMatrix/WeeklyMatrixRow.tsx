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
      <td className="px-3.5 py-3 align-middle w-[180px]">
        <b className="font-display block text-xs sm:text-sm font-bold text-[#1D3557] truncate">{template.name}</b>
        <span className="text-[11px] sm:text-xs text-slate-400 tabular-nums block mt-0.5">
          {template.startTime} – {template.endTime}
        </span>
        <button
          type="button"
          onClick={() => onToggleRow(template)}
          disabled={!canToggleRow}
          aria-pressed={allChecked}
          aria-label={`Pilih semua hari untuk sesi ${template.name}`}
          className="mt-1.5 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#00B4D8] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#0077B6] transition-colors hover:bg-[#E0FBFC] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-slate-300 disabled:hover:bg-transparent cursor-pointer whitespace-nowrap"
        >
          <CheckCheck size={12} aria-hidden="true" />
          Semua hari
          <span className="rounded bg-[#E0FBFC] px-1 py-0.2 text-[9px] tabular-nums font-bold text-[#0077B6]">
            {checkedCount}/{HARI.length}
          </span>
        </button>
      </td>
      {HARI.map((day) => {
        const key = slotKey(template.name, day);
        const isSaved = existing.has(key);
        const isSelected = selected.has(key);

        return (
          <td key={day} className="px-1 py-2.5 text-center align-middle">
            {isSaved ? (
              <div
                title={`${template.name} (${day}) sudah tersimpan di database`}
                className="inline-flex flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-1.5 py-1 text-center cursor-not-allowed w-full max-w-[62px]"
              >
                <Check size={13} className="text-emerald-600 font-bold" />
                <span className="text-[9px] font-semibold text-emerald-700 leading-none mt-0.5 truncate">
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
                className={`inline-flex flex-col items-center justify-center rounded-lg border text-center transition-all duration-150 cursor-pointer w-full max-w-[62px] py-1 px-1.5 select-none ${
                  isSelected
                    ? 'border-[#0077B6] bg-[#E0FBFC] text-[#0077B6] font-bold shadow-2xs ring-2 ring-[#00B4D8]/30'
                    : 'border-gray-200 bg-white text-slate-400 hover:border-[#00B4D8] hover:text-[#0077B6] hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-xs border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#0077B6] bg-[#0077B6] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check size={8} strokeWidth={3} />}
                </div>
                <span className="text-[9px] font-medium leading-none mt-1">
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
