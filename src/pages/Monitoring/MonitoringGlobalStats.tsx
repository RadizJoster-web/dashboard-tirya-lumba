import React from 'react';
import { Trophy, GraduationCap, MapPin, Scale } from 'lucide-react';
import { Stat } from '../../components/ui';

interface GlobalStatsProps {
  totalInstructors: number;
  totalStudents: number;
  totalPools: number;
}

export const MonitoringGlobalStats: React.FC<GlobalStatsProps> = ({
  totalInstructors,
  totalStudents,
  totalPools,
}) => {
  const avgRatio =
    totalInstructors > 0
      ? (totalStudents / totalInstructors).toFixed(1)
      : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Stat
        label="Total Pelatih Aktif"
        value={totalInstructors}
        subtitle="Terdaftar & aktif mengajar"
        badge={<Trophy size={18} className="text-[#0077B6]" />}
      />
      <Stat
        label="Total Murid Aktif"
        value={totalStudents}
        subtitle="Siswa dengan kelas berjalan"
        badge={<GraduationCap size={18} className="text-[#0077B6]" />}
      />
      <Stat
        label="Total Kolam Cabang"
        value={totalPools}
        subtitle="Lokasi kolam renang mitra"
        badge={<MapPin size={18} className="text-[#0077B6]" />}
      />
      <Stat
        label="Rasio Murid / Pelatih"
        value={`${avgRatio} : 1`}
        subtitle="Rata-rata beban global"
        badge={<Scale size={18} className="text-[#0077B6]" />}
      />
    </div>
  );
};
