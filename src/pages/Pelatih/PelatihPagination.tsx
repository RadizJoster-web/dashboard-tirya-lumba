import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
      <span className="font-medium tabular-nums">
        Total <strong className="text-[#1D3557] font-semibold">{totalItems}</strong> pelatih terdaftar
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={safePage < 2}
          onClick={onPrev}
          className="rounded-full px-3 py-1 gap-1"
        >
          <ChevronLeft size={14} />
          Sebelumnya
        </Button>
        <span className="rounded-full bg-white border border-gray-200 px-3 py-1 font-semibold text-[#1D3557] tabular-nums shadow-2xs">
          {safePage} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={safePage >= totalPages}
          onClick={onNext}
          className="rounded-full px-3 py-1 gap-1"
        >
          Berikutnya
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
