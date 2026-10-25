import Stat from '../../components/ui/Stat';

interface OverviewStatsProps {
  totalSiswa: number;
  totalGuru: number;
  totalPendaftar: number;
}

export default function OverviewStats({ totalSiswa, totalGuru, totalPendaftar }: OverviewStatsProps) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2.5">
      <Stat label="Total siswa" value={String(totalSiswa)} />
      <Stat label="Total guru" value={String(totalGuru)} />
      <Stat label="Total pendaftar (tahun ini)" value={String(totalPendaftar)} />
    </div>
  );
}
