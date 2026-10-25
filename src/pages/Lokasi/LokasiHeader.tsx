import { Button } from '../../components/ui';

interface LokasiHeaderProps {
  onAddClick: () => void;
}

export default function LokasiHeader({ onAddClick }: LokasiHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl leading-8 font-bold">Lokasi Kolam</h2>
        <p className="text-slate-500">Data lokasi dan kategori kolam renang per area</p>
      </div>
      <Button onClick={onAddClick}>+ Tambah lokasi</Button>
    </div>
  );
}
