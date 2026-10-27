import type { FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui';
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
    <section className="min-w-0 max-w-full rounded-xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5">
        <h3 className="font-display m-0 text-base font-bold text-[#1D3557]">
          Generator Template Sesi
        </h3>
        <p className="mt-0.5 mb-0 text-xs text-slate-500 font-normal">
          Tentukan nama sesi dan jam mulai. Jam selesai dihitung otomatis (+1 jam).
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-4 grid items-end gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_140px_140px_auto]"
        >
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Nama Sesi
            <input
              value={templateName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Contoh: Sesi Pagi 1"
              required
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Jam Mulai
            <input
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              required
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all"
            />
          </label>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Jam Selesai
            </span>
            <span className="mt-1.5 flex min-h-[38px] items-center rounded-lg bg-slate-50 border border-gray-200 px-3.5 py-2 text-xs font-semibold text-[#1D3557] tabular-nums">
              {nextEnd || '-'}
            </span>
          </div>
          <Button type="submit" size="sm" className="h-[38px] w-full sm:w-auto">
            Tambah Sesi
          </Button>
        </form>
      </div>

      {templates.length === 0 ? (
        <p className="m-0 border-t border-gray-100 px-4 sm:px-5 py-4 text-xs text-slate-400">
          Belum ada template sesi. Buat template sesi pertama Anda di atas.
        </p>
      ) : (
        <div className="border-t border-gray-100 px-4 sm:px-5 py-3.5 bg-slate-50/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Template Sesi Terdaftar ({templates.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs shadow-2xs"
              >
                <span className="font-bold text-[#1D3557]">{template.name}</span>
                <span className="text-slate-400 tabular-nums">
                  {template.startTime}–{template.endTime}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(template.id)}
                  title="Hapus template sesi"
                  className="text-slate-400 hover:text-[#FF6F59] transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
