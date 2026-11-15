import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui';
import type { ServerLocation } from '../../lib/api/types';
import { PACKAGE_TYPES } from './types';
import type { ImageForm, PackageType, PriceForm } from './types';
import { PaketPriceCard } from './PaketPriceCard';

interface PaketPriceFormProps {
  locations: ServerLocation[];
  activeLocationId: string;
  savedPrices: PriceForm;
  savedImages: ImageForm;
  saving: boolean;
  canSave: boolean;
  onLocationChange: (id: string) => void;
  onSubmit: (prices: PriceForm, images: ImageForm) => Promise<boolean>;
}

export default function PaketPriceForm({
  locations,
  activeLocationId,
  savedPrices,
  savedImages,
  saving,
  canSave,
  onLocationChange,
  onSubmit,
}: PaketPriceFormProps) {
  const [draftPrices, setDraftPrices] = useState<PriceForm | null>(null);
  const [draftImages, setDraftImages] = useState<ImageForm | null>(null);

  const prices = draftPrices ?? savedPrices;
  const images = draftImages ?? savedImages;

  function handleLocationChange(id: string) {
    setDraftPrices(null);
    setDraftImages(null);
    onLocationChange(id);
  }

  function handlePriceChange(type: PackageType, val: string) {
    setDraftPrices({ ...prices, [type]: val });
  }

  function handleImageChange(type: PackageType, url: string) {
    setDraftImages({ ...images, [type]: url });
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

    const success = await onSubmit(prices, images);
    if (success) {
      setDraftPrices(null);
      setDraftImages(null);
    }
  }

  const staggerClasses = ['anim-enter-1', 'anim-enter-2', 'anim-enter-3', 'anim-enter-4'];

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="anim-enter rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-display text-base font-bold text-[#1D3557]">
            Form Tarif & Gambar Paket per Kolam
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 font-normal">
            Pilih lokasi kolam, unggah foto visual paket kursus, dan tentukan tarif harga
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
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4 pt-1">
        {PACKAGE_TYPES.map((type, idx) => (
          <PaketPriceCard
            key={type}
            type={type}
            value={prices[type]}
            imageUrl={images[type]}
            staggerClass={staggerClasses[idx % 4]}
            onChange={handlePriceChange}
            onImageChange={handleImageChange}
          />
        ))}
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-gray-100">
        <Button
          type="submit"
          size="sm"
          disabled={saving || !canSave || !activeLocationId}
        >
          {saving ? 'Menyimpan Paket…' : 'Simpan Perubahan Paket'}
        </Button>
      </div>
    </form>
  );
}
