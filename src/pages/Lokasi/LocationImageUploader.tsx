import React, { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest, assetUrl } from '../../lib/api/client';

interface LocationImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export const LocationImageUploader: React.FC<LocationImageUploaderProps> = ({
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = assetUrl(value);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
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
      const res = await apiRequest<{ imageUrl?: string }>('/upload-file/location', {
        method: 'POST',
        body: formData,
      });

      if (res?.imageUrl) {
        onChange(res.imageUrl);
        toast.success('Foto kolam renang berhasil diunggah.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengunggah foto kolam.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Foto Kolam Renang (Opsional)
      </label>
      <div className="relative group h-28 w-full rounded-lg border border-dashed border-gray-300 bg-slate-50 flex items-center justify-center overflow-hidden">
        {preview ? (
          <>
            <img src={preview} alt="Kolam" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full bg-white/90 p-2 text-slate-700 hover:bg-white cursor-pointer"
                title="Ganti Foto"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="rounded-full bg-red-500/90 p-2 text-white hover:bg-red-600 cursor-pointer"
                title="Hapus Foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-[#0077B6] cursor-pointer p-4"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#0077B6]" />
            ) : (
              <>
                <Camera className="w-6 h-6" />
                <span className="text-xs font-medium">+ Unggah Foto Kolam Renang</span>
              </>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => void handleFile(e)}
        />
      </div>
      <input type="hidden" name="imageUrl" value={value} />
    </div>
  );
};
