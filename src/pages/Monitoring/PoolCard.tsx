import React from 'react';
import { ChevronRight, MapPin, Trophy, GraduationCap, Waves } from 'lucide-react';
import { assetUrl } from '../../lib/api/client';
import type { PoolCapacityItem } from '../../lib/api/types';

interface PoolCardProps {
  pool: PoolCapacityItem;
  onSelect: (poolId: string) => void;
}

export const PoolCard: React.FC<PoolCardProps> = ({ pool, onSelect }) => {
  const imageSrc = pool.imageUrl ? assetUrl(pool.imageUrl) : null;
  const ratio =
    pool.totalInstructors > 0
      ? (pool.totalStudents / pool.totalInstructors).toFixed(1)
      : '0';

  return (
    <div
      onClick={() => onSelect(pool.id)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#0077B6]/40 hover:shadow-md cursor-pointer"
    >
      {/* Gambar Kolam */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={pool.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <Waves size={36} strokeWidth={1.5} />
          </div>
        )}

        {/* Badge Status Pendaftaran Pelatih */}
        <div className="absolute top-3 right-3">
          {pool.isCoachRegistrationOpen ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              BUKA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/95 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-white" />
              TUTUP
            </span>
          )}
        </div>

        {/* Tag Wilayah */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <MapPin size={11} />
            {pool.areaName ?? 'Wilayah Umum'}
          </span>
        </div>
      </div>

      {/* Konten Card */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-[#1D3557] group-hover:text-[#0077B6] transition-colors truncate">
            {pool.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{pool.category}</p>
        </div>

        {/* Ringkasan Cepat: X Pelatih | Y Murid */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-100 bg-slate-50/80 p-2.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100/80 text-[#0077B6] shrink-0">
              <Trophy size={14} />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">Pelatih</span>
              <span className="font-bold text-[#1D3557]">{pool.totalInstructors}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700 shrink-0">
              <GraduationCap size={14} />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-medium">Murid</span>
              <span className="font-bold text-[#1D3557]">{pool.totalStudents}</span>
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
          <span className="text-[11px] font-medium text-slate-500">
            Rasio: <strong className="text-[#1D3557]">{ratio}</strong> murid / pelatih
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#0077B6] group-hover:translate-x-0.5 transition-transform">
            Lihat Alokasi
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
