import Stat from '../../components/ui/Stat';
import StatusBadge from '../../components/ui/StatusBadge';
import { RoleTag } from '../../components/ui';

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
  pendaftarLabel = 'Total Pendaftar',
}: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 mb-6">
      {/* 1. Primary Hero Card (Total Siswa Aktif) */}
      <Stat
        variant="primary"
        label="Total Siswa Aktif"
        value={totalSiswa}
        subtitle="Siswa dengan kuota sesi > 0"
        badge={
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B4D8] animate-pulse" />
            Aktif
          </span>
        }
      />

      {/* 2. Total Guru / Pelatih (White Structural Card) */}
      <Stat
        variant="default"
        label="Total Guru / Pelatih"
        value={totalGuru}
        subtitle="Instruktur berlisensi aktif"
        badge={<RoleTag role="instructor">Pelatih</RoleTag>}
      />

      {/* 3. Total Pendaftar (White Structural Card) */}
      <Stat
        variant="default"
        label={pendaftarLabel}
        value={totalPendaftar}
        subtitle="Registrasi pada rentang waktu terpilih"
        badge={<StatusBadge status="PENDING" label="Periode Terpilih" />}
      />
    </div>
  );
}
