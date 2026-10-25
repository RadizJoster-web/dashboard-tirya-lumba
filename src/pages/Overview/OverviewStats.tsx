import Stat from '../../components/ui/Stat';

interface OverviewStatsProps {
  totalSiswa: number;
  totalGuru: number;
  totalPendaftar: number;
  pendaftarLabel?: string;
}

export default function OverviewStats({
  totalSiswa,
  totalGuru,
  totalPendaftar,
  pendaftarLabel = 'Total pendaftar (periode ini)',
}: OverviewStatsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <Stat label="Total siswa" value={String(totalSiswa)} />
      <Stat label="Total guru" value={String(totalGuru)} />
      <Stat label={pendaftarLabel} value={String(totalPendaftar)} />
    </div>
  );
}
