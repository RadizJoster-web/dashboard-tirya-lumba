import { CheckCheck } from 'lucide-react';
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
    <tr className="border-b border-gray-200 last:border-0">
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
}
