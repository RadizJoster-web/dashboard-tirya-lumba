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
