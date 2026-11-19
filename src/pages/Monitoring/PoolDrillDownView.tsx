import React from 'react';
import { ArrowLeft, ExternalLink, MapPin, Trophy, GraduationCap, Scale, Loader2 } from 'lucide-react';
import { CoachAccordionItem } from './CoachAccordionItem';
import type { PoolCapacityItem } from '../../lib/api/types';

interface PoolDrillDownViewProps {
  pool: PoolCapacityItem;
  onBack: () => void;
  onToggleCoachStatus: (poolId: string, currentStatus: boolean) => Promise<void>;
  isToggling: boolean;
}

export const PoolDrillDownView: React.FC<PoolDrillDownViewProps> = ({
  pool,
  onBack,
  onToggleCoachStatus,
  isToggling,
}) => {
  const ratio =
    pool.totalInstructors > 0
      ? (pool.totalStudents / pool.totalInstructors).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0077B6] transition-colors cursor-pointer"
      >
        <ArrowLeft size={15} />
        Kembali ke Katalog Kolam
      </button>

      {/* Header Kolam & Kontrol Utama BUKA / TUTUP */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <MapPin size={10} />
                {pool.areaName ?? 'Wilayah Umum'}
              </span>
              <span className="text-xs text-slate-400">• {pool.category}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1D3557]">
              {pool.name}
            </h2>
            {pool.mapUrl && (
              <a
                href={pool.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#0077B6] hover:underline mt-1 font-medium"
              >
                Buka di Google Maps
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Tombol Aksi Utama: TOGGLE SWITCH Pendaftaran Pelatih BUKA / TUTUP */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-gray-200">
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Status Pendaftaran Pelatih:</span>
              <span
                className={`font-bold uppercase ${
                  pool.isCoachRegistrationOpen ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {pool.isCoachRegistrationOpen ? '🟢 Buka untuk Pelatih Baru' : '🔴 Tutup (Kuota Penuh)'}
              </span>
            </div>
            <button
              type="button"
              disabled={isToggling}
              onClick={() => onToggleCoachStatus(pool.id, pool.isCoachRegistrationOpen)}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 ${
                pool.isCoachRegistrationOpen ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  pool.isCoachRegistrationOpen ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isToggling && <Loader2 size={12} className="animate-spin text-slate-400" />}
              </span>
            </button>
          </div>
        </div>

        {/* Metrik Kolam */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3.5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0077B6] shrink-0">
              <Trophy size={18} />
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Total Pelatih</span>
              <span className="text-lg font-bold text-[#1D3557]">{pool.totalInstructors} Orang</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3.5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Total Murid Aktif</span>
              <span className="text-lg font-bold text-[#1D3557]">{pool.totalStudents} Siswa</span>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-slate-50/80 p-3.5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 shrink-0">
              <Scale size={18} />
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Rasio Beban Murid</span>
              <span className="text-lg font-bold text-[#1D3557]">{ratio} Murid / Guru</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Daftar Pelatih di Kolam Ini */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-[#1D3557]">
            Daftar Pelatih &amp; Alokasi Murid ({pool.coaches.length})
          </h3>
          <span className="text-xs text-slate-400">
            Klik baris pelatih untuk melihat murid binaannya
          </span>
        </div>

        {pool.coaches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <p className="text-xs text-slate-400 italic">
              Belum ada pelatih yang ditugaskan di kolam ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pool.coaches.map((c, idx) => (
              <CoachAccordionItem key={c.id} coach={c} defaultExpanded={idx === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
