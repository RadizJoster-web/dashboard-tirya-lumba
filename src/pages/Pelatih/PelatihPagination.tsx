import { Button } from '../../components/ui';

interface PelatihPaginationProps {
  totalItems: number;
  safePage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PelatihPagination({
  totalItems,
  safePage,
  totalPages,
  onPrev,
  onNext,
}: PelatihPaginationProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-slate-500">
      <span>{totalItems} pelatih</span>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage < 2} onClick={onPrev}>
          Sebelumnya
        </Button>
        <span className="px-2 py-1">
          {safePage} / {totalPages}
        </span>
        <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage >= totalPages} onClick={onNext}>
          Berikutnya
        </Button>
      </div>
    </div>
  );
}
