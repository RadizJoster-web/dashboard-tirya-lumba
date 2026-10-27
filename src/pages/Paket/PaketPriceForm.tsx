import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui';
import { formatRp } from '../../lib/format';
import type { ServerLocation } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { PackageType, PriceForm } from './types';

interface PaketPriceFormProps {
  locations: ServerLocation[];
  activeLocationId: string;
  savedPrices: PriceForm;
  saving: boolean;
  canSave: boolean;
  onLocationChange: (id: string) => void;
  onSubmit: (prices: PriceForm) => Promise<boolean>;
}

export default function PaketPriceForm({
  locations,
  activeLocationId,
  savedPrices,
  saving,
  canSave,
  onLocationChange,
  onSubmit,
}: PaketPriceFormProps) {
  const [draft, setDraft] = useState<PriceForm | null>(null);

  const prices = draft ?? savedPrices;

  function handleLocationChange(id: string) {
    setDraft(null);
    onLocationChange(id);
  }

  function handlePriceChange(type: PackageType, val: string) {
    setDraft({ ...prices, [type]: val });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeLocationId) {
      toast.error('Pilih lokasi kolam renang terlebih dahulu.');
      return;
    }

    for (const type of PACKAGE_TYPES) {
      const value = prices[type].trim();
      if (!value || !Number.isFinite(Number(value)) || Number(value) < 0) {
        toast.error(`Harga paket ${type} wajib diisi dengan nominal yang valid.`);
        return;
      }
    }

    const success = await onSubmit(prices);
    if (success) {
      setDraft(null);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-[#1D3557]">
            Form Tarif Paket per Kolam
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 font-normal">
            Pilih lokasi kolam lalu tentukan nominal biaya tarif kursus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Lokasi Kolam:
          </label>
          <select
            value={activeLocationId}
            onChange={(e) => handleLocationChange(e.target.value)}
            required
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#1D3557] shadow-2xs focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 cursor-pointer"
          >
            <option value="">Pilih Lokasi Kolam</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4 pt-1">
        {PACKAGE_TYPES.map((type) => {
          const num = Number(prices[type]);
          const preview = Number.isFinite(num) && num > 0 ? formatRp(num) : 'Rp 0';
          return (
            <div
              key={type}
              className="rounded-xl border border-gray-200 bg-slate-50/60 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#1D3557]">
                  {type}
                </span>
                <span className="rounded-full bg-[#E0FBFC] px-2 py-0.5 text-[10px] font-bold text-[#0077B6]">
                  4 Sesi
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Tarif Kursus (Rp)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  inputMode="numeric"
                  value={prices[type]}
                  onChange={(e) => handlePriceChange(type, e.target.value)}
                  placeholder="Contoh: 350000"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 tabular-nums transition-all"
                />
              </div>

              <div className="pt-1">
                <span className="text-[11px] font-semibold text-[#0077B6] tabular-nums block">
                  {preview}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-gray-100">
        <Button
          type="submit"
          size="sm"
          disabled={saving || !canSave || !activeLocationId}
        >
          {saving ? 'Menyimpan Tarif…' : 'Simpan Perubahan Tarif'}
        </Button>
      </div>
    </form>
  );
}
