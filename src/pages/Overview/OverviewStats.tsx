import { Users, GraduationCap, CalendarCheck } from 'lucide-react';

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
      {/* 1. Siswa Aktif Card */}
      <div className="anim-enter-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Total Siswa Aktif
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0077B6] flex items-center justify-center shrink-0">
            <Users size={16} />
          </div>
        </div>
        <div className="mt-3">
          <span className="font-display block text-3xl font-extrabold tracking-tight text-[#1D3557] tabular-nums">
            {totalSiswa}
          </span>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Siswa dengan kuota sesi &gt; 0</span>
          </div>
        </div>
      </div>

      {/* 2. Guru / Pelatih Card */}
      <div className="anim-enter-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
            Total Guru / Pelatih
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#00B4D8] flex items-center justify-center shrink-0">
            <GraduationCap size={16} />
          </div>
        </div>
        <div className="mt-3">
          <span className="font-display block text-3xl font-extrabold tracking-tight text-[#1D3557] tabular-nums">
            {totalGuru}
          </span>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0077B6]" />
            <span>Instruktur berlisensi aktif</span>
          </div>
        </div>
      </div>

      {/* 3. Pendaftar Periode Card */}
      <div className="anim-enter-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 truncate" title={pendaftarLabel}>
            {pendaftarLabel}
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarCheck size={16} />
          </div>
        </div>
        <div className="mt-3">
          <span className="font-display block text-3xl font-extrabold tracking-tight text-[#1D3557] tabular-nums">
            {totalPendaftar}
          </span>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Registrasi rentang waktu terpilih</span>
          </div>
        </div>
      </div>
    </div>
  );
}
