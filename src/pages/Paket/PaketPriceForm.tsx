import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui';
import { formatRp } from '../../lib/format';
import type { ServerLocation } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { PackageType, PriceForm } from './types';

const inputClass =
  'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

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
      toast.error('Pilih lokasi terlebih dahulu.', {
        style: { color: '#B3341F' },
      });
      return;
    }

    for (const type of PACKAGE_TYPES) {
      const value = prices[type].trim();
      if (!value || !Number.isFinite(Number(value)) || Number(value) < 0) {
        toast.error(`Harga ${type} wajib diisi dengan angka yang valid.`, {
          style: { color: '#B3341F' },
        });
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
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <label className="mb-4 block font-semibold">
        Lokasi kolam
        <select
          value={activeLocationId}
          onChange={(e) => handleLocationChange(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Pilih lokasi</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PACKAGE_TYPES.map((type) => (
          <label key={type} className="block font-semibold">
            {type}
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="numeric"
              value={prices[type]}
              onChange={(e) => handlePriceChange(type, e.target.value)}
              placeholder="350000"
              required
              className={inputClass}
            />
            <span className="mt-1 block text-[13px] font-medium text-slate-500">
              {prices[type] && Number.isFinite(Number(prices[type]))
                ? formatRp(Number(prices[type]))
                : 'Harga dalam rupiah'}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="submit"
          disabled={saving || !activeLocationId || !canSave}
        >
          {saving ? 'Menyimpan…' : 'Simpan harga'}
        </Button>
      </div>
    </form>
  );
}
