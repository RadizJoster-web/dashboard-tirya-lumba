import { Button } from '../../components/ui';

interface JadwalHeaderProps {
  sessionsError: string | null;
  onRetry: () => void;
}

export default function JadwalHeader({ sessionsError, onRetry }: JadwalHeaderProps) {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Jadwal dan Sesi</h2>
        <p className="text-slate-500">Susun sesi lalu petakan ke hari dalam satu langkah</p>
      </div>

      {sessionsError ? (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FFE4DF] bg-[#FFF6F4] p-3 text-sm text-[#B3341F]">
          <span>Gagal memuat jadwal: {sessionsError}</span>
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : null}
    </>
  );
}
