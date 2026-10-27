import { HARI } from '../../../lib/format';
import { DAY_SHORT } from '../session-templates';
import type { SessionTemplate } from '../session-templates';
import WeeklyMatrixRow from './WeeklyMatrixRow';

interface WeeklyMatrixTableProps {
  templates: SessionTemplate[];
  existing: Set<string>;
  selected: Set<string>;
  saving: boolean;
  onToggle: (key: string) => void;
  onToggleRow: (template: SessionTemplate) => void;
}

export default function WeeklyMatrixTable({
  templates,
  existing,
  selected,
  saving,
  onToggle,
  onToggleRow,
}: WeeklyMatrixTableProps) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
      <table className="w-full min-w-[760px] table-fixed border-collapse">
        <colgroup>
          <col style={{ width: '220px' }} />
          {HARI.map((day) => (
            <col key={day} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100 bg-slate-50/70">
            <th
              scope="col"
              className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Template Sesi
            </th>
            {HARI.map((day, index) => (
              <th
                key={day}
                scope="col"
                title={day}
                className="py-3 px-2 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                {DAY_SHORT[index]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {templates.map((template) => (
            <WeeklyMatrixRow
              key={template.id}
              template={template}
              existing={existing}
              selected={selected}
              saving={saving}
              onToggle={onToggle}
              onToggleRow={onToggleRow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
