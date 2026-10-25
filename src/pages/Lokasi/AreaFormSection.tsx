import { useState } from 'react';
import type { FormEvent } from 'react';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
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
    <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-azure text-primary">
          <MapPin size={18} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg leading-6 font-bold text-ink">Master Area / Kota</h3>
          <p className="text-xs text-slate-500">
            Daftarkan area/kota terlebih dahulu sebelum membuat titik lokasi kolam renang
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
            placeholder="Ketik nama area/kota baru (contoh: Jakarta Barat, Tangerang Selatan, Bintaro)..."
            disabled={savingArea}
            required
            minLength={2}
            maxLength={50}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 font-medium transition-all duration-300 ease-in-out focus:border-aqua focus:ring-2 focus:ring-aqua/40 focus:outline-none"
          />
        </div>
        <Button
          type="submit"
          disabled={savingArea || !areaName.trim()}
          className="shrink-0"
        >
          {savingArea ? 'Menyimpan…' : '+ Tambah Area'}
        </Button>
      </form>

      <div className="mt-4 border-t border-gray-100 pt-3.5">
        <div className="mb-2.5 flex items-center justify-between text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <span>Area Terdaftar ({areas.length})</span>
          {areas.length === 0 ? null : (
            <span className="text-[11px] font-normal lowercase text-slate-400">
              klik ikon pensil untuk ubah atau sampah untuk hapus
            </span>
          )}
        </div>

        {areas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50/50 p-4 text-center text-sm text-slate-500">
            Belum ada area/kota terdaftar. Tambahkan nama area di atas agar bisa memilih area saat mendaftarkan lokasi kolam renang.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => {
              const locationCount = area._count?.locations ?? 0;
              return (
                <div
                  key={area.id}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-slate-50 px-3 py-1.5 text-sm transition-colors hover:bg-slate-100/80"
                >
                  <span className="font-semibold text-slate-800">{area.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      locationCount > 0
                        ? 'bg-azure text-primary'
                        : 'bg-gray-200/70 text-slate-600'
                    }`}
                    title={`${locationCount} kolam terdaftar di area ini`}
                  >
                    {locationCount} kolam
                  </span>
                  <div className="flex items-center gap-1 border-l border-gray-200 pl-1.5">
                    <button
                      type="button"
                      onClick={() => onEditArea(area)}
                      title={`Edit area ${area.name}`}
                      className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-primary"
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteArea(area)}
                      title={`Hapus area ${area.name}`}
                      className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-[#B3341F]"
                    >
                      <Trash2 size={13} aria-hidden="true" />
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
