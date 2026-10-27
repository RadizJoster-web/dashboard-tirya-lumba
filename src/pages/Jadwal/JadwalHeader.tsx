import { AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui';

interface JadwalHeaderProps {
  sessionsError: string | null;
  onRetry: () => void;
}

export default function JadwalHeader({ sessionsError, onRetry }: JadwalHeaderProps) {
  return (
    <>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
            Penjadwalan & Sesi Kolam
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 font-normal">
            Susun template waktu latihan dan petakan ke matriks jadwal mingguan (Senin – Minggu)
          </p>
        </div>
      </div>

      {sessionsError ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>Gagal memuat data sesi jadwal: {sessionsError}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : null}
    </>
  );
}
