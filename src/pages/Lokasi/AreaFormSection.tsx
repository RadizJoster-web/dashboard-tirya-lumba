import { useState } from 'react';
import type { FormEvent } from 'react';
import { MapPin, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '../../components/ui';
import type { ServerArea } from '../../lib/api/types';

interface AreaFormSectionProps {
  areas: ServerArea[];
  savingArea: boolean;
  onAddArea: (name: string) => Promise<boolean>;
  onEditArea: (area: ServerArea) => void;
  onDeleteArea: (area: ServerArea) => void;
}

export default function AreaFormSection({
  areas,
  savingArea,
  onAddArea,
  onEditArea,
  onDeleteArea,
}: AreaFormSectionProps) {
  const [areaName, setAreaName] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = await onAddArea(areaName);
    if (ok) {
      setAreaName('');
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#E0FBFC] text-[#0077B6] border border-[#00B4D8]/20">
          <MapPin size={18} aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-[#1D3557]">
            Master Area & Wilayah Operasional
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            Kelola data kota/wilayah operasional sebelum mendaftarkan titik kolam renang
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            name="name"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            placeholder="Ketik nama area/kota baru (contoh: Tangerang Selatan, Jakarta Barat, Bintaro)..."
            disabled={savingArea}
            required
            minLength={2}
            maxLength={50}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={savingArea || !areaName.trim()}
          className="shrink-0 h-[38px]"
        >
          <Plus size={14} className="mr-1" />
          {savingArea ? 'Menyimpan…' : 'Tambah Area'}
        </Button>
      </form>

      <div className="mt-4 border-t border-gray-100 pt-3.5">
        <div className="mb-2.5 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <span>Area Terdaftar ({areas.length})</span>
        </div>

        {areas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
            Belum ada area/kota terdaftar. Tambahkan nama area di atas.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => {
              const locationCount = area._count?.locations ?? 0;
              return (
                <div
                  key={area.id}
                  className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-slate-50/70 px-3 py-1.5 text-xs transition-colors hover:bg-white hover:shadow-2xs"
                >
                  <span className="font-semibold text-[#1D3557]">{area.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      locationCount > 0
                        ? 'bg-[#E0FBFC] text-[#0077B6]'
                        : 'bg-gray-200/60 text-slate-500'
                    }`}
                    title={`${locationCount} kolam terdaftar di area ini`}
                  >
                    {locationCount} kolam
                  </span>
                  <div className="ml-1 flex items-center gap-1 border-l border-gray-200 pl-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onEditArea(area)}
                      title={`Ubah area ${area.name}`}
                      className="p-1 text-slate-400 hover:text-[#0077B6] cursor-pointer"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteArea(area)}
                      title={`Hapus area ${area.name}`}
                      className="p-1 text-slate-400 hover:text-[#FF6F59] cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
