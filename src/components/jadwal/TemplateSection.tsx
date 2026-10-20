import type { FormEvent } from 'react';
import { Button } from '../ui';
import { inputClass } from './session-templates';
import type { SessionTemplate } from './session-templates';

interface TemplateSectionProps {
  templates: SessionTemplate[];
  templateName: string;
  startTime: string;
  nextEnd: string;
  onNameChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRemove: (id: string) => void;
}

export default function TemplateSection({
  templates,
  templateName,
  startTime,
  nextEnd,
  onNameChange,
  onStartTimeChange,
  onSubmit,
  onRemove,
}: TemplateSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="p-4">
        <h3 className="m-0 text-lg font-bold">Sesi</h3>
        <p className="mt-1 mb-0 text-sm text-slate-500">Buat nama sesi dan jam mulai. Jam selesai otomatis +1 jam.</p>
        <form onSubmit={onSubmit} className="mt-3 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_140px_140px_auto]">
          <label className="block font-semibold">
            Nama sesi
            <input
              value={templateName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Contoh: Sesi 1"
              required
              className={inputClass}
            />
          </label>
          <label className="block font-semibold">
            Jam mulai
            <input type="time" value={startTime} onChange={(e) => onStartTimeChange(e.target.value)} required className={inputClass} />
          </label>
          <div>
            <span className="block font-semibold">Jam selesai</span>
            <span className="mt-1 flex min-h-[42px] items-center rounded-lg bg-basedash px-3 py-2 font-medium text-slate-600">
              {nextEnd || '-'}
            </span>
          </div>
          <Button type="submit">Tambah sesi</Button>
        </form>
      </div>
      {templates.length === 0 ? (
        <p className="m-0 border-t border-gray-200 px-4 py-5 text-sm text-slate-500">
          Belum ada sesi. Tambahkan sesi pertama di atas.
        </p>
      ) : (
        <ul className="m-0 list-none divide-y divide-gray-200 border-t border-gray-200 p-0">
          {templates.map((template) => (
            <li key={template.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
              <span>
                <b>{template.name}</b>
                <span className="ml-2 text-sm text-slate-500">{template.startTime} - {template.endTime}</span>
              </span>
              <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => onRemove(template.id)}>
                Hapus
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
