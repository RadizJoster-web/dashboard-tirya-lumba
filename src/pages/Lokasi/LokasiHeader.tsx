import { Plus } from 'lucide-react';
import { Button } from '../../components/ui';

interface LokasiHeaderProps {
  onAddClick: () => void;
}

export default function LokasiHeader({ onAddClick }: LokasiHeaderProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h3 className="font-display text-lg font-bold text-[#1D3557]">
          Daftar Titik Kolam Renang Mitra
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 font-normal">
          Daftar lokasi kolam renang yang dikelompokkan berdasarkan wilayah operasional
        </p>
      </div>
      <Button onClick={onAddClick} size="sm" className="w-full sm:w-auto">
        <Plus size={14} className="mr-1" />
        Tambah Lokasi Kolam
      </Button>
    </div>
  );
}
