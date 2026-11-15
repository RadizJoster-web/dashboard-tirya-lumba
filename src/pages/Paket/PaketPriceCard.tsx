import React, { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatRp } from '../../lib/format';
import { apiRequest, assetUrl } from '../../lib/api/client';
import type { PackageType } from './types';

interface PaketPriceCardProps {
  type: PackageType;
  value: string;
  imageUrl: string;
  staggerClass: string;
  onChange: (type: PackageType, val: string) => void;
  onImageChange: (type: PackageType, url: string) => void;
}

export const PaketPriceCard: React.FC<PaketPriceCardProps> = ({
  type,
  value,
  imageUrl,
  staggerClass,
  onChange,
  onImageChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const num = Number(value);
  const preview = Number.isFinite(num) && num > 0 ? formatRp(num) : 'Rp 0';
  const fullImageUrl = assetUrl(imageUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4.5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 4.5 MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiRequest<{ imageUrl?: string }>('/upload-file/package', {
        method: 'POST',
        body: formData,
      });

      if (res?.imageUrl) {
        onImageChange(type, res.imageUrl);
        toast.success(`Gambar paket ${type} berhasil diunggah.`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div
      className={`${staggerClass} rounded-xl border border-gray-200 bg-slate-50/60 p-4 space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-sm text-[#1D3557]">{type}</span>
        <span className="rounded-full bg-[#E0FBFC] px-2 py-0.5 text-[10px] font-bold text-[#0077B6]">
          4 Sesi
        </span>
      </div>

      <div className="relative group/img h-24 w-full rounded-lg border border-dashed border-gray-300 bg-white overflow-hidden flex items-center justify-center">
        {fullImageUrl ? (
          <>
            <img src={fullImageUrl} alt={type} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full bg-white/90 p-1.5 text-xs text-slate-700 hover:bg-white cursor-pointer"
                title="Ganti Gambar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onImageChange(type, '')}
                className="rounded-full bg-red-500/90 p-1.5 text-xs text-white hover:bg-red-600 cursor-pointer"
                title="Hapus Gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#0077B6] cursor-pointer p-2"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#0077B6]" />
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-medium">+ Unggah Foto</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
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
          value={value}
          onChange={(e) => onChange(type, e.target.value)}
          placeholder="Contoh: 350000"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 tabular-nums transition-all"
        />
      </div>

      <div className="pt-0.5">
        <span className="text-[11px] font-semibold text-[#0077B6] tabular-nums block">
          {preview}
        </span>
      </div>
    </div>
  );
};
