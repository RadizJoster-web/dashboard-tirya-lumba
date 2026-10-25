import { Button } from '../../components/ui';

export type TipeAntrean = 'Semua' | 'Murid' | 'Pelatih';

interface PendaftaranFilterProps {
  tipeAntrean: TipeAntrean;
  onChange: (tipe: TipeAntrean) => void;
}

export default function PendaftaranFilter({
  tipeAntrean,
  onChange,
}: PendaftaranFilterProps) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2">
      <Button
        variant={tipeAntrean === 'Semua' ? 'primary' : 'ghost'}
        className="px-3 py-1.5 text-xs min-h-0"
        onClick={() => onChange('Semua')}
      >
        Semua
      </Button>
      <Button
        variant={tipeAntrean === 'Murid' ? 'primary' : 'ghost'}
        className="px-3 py-1.5 text-xs min-h-0"
        onClick={() => onChange('Murid')}
      >
        Murid
      </Button>
      <Button
        variant={tipeAntrean === 'Pelatih' ? 'primary' : 'ghost'}
        className="px-3 py-1.5 text-xs min-h-0"
        onClick={() => onChange('Pelatih')}
      >
        Pelatih
      </Button>
    </div>
  );
}
