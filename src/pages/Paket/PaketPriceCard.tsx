import React from 'react';
import { formatRp } from '../../lib/format';
import type { PackageType } from './types';

interface PaketPriceCardProps {
  type: PackageType;
  value: string;
  staggerClass: string;
  onChange: (type: PackageType, val: string) => void;
}

export const PaketPriceCard: React.FC<PaketPriceCardProps> = ({
  type,
  value,
  staggerClass,
  onChange,
}) => {
  const num = Number(value);
  const preview = Number.isFinite(num) && num > 0 ? formatRp(num) : 'Rp 0';

  return (
    <div
      className={`${staggerClass} rounded-xl border border-gray-200 bg-slate-50/60 p-4 space-y-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs`}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-sm text-[#1D3557]">
          {type}
        </span>
        <span className="rounded-full bg-[#E0FBFC] px-2 py-0.5 text-[10px] font-bold text-[#0077B6]">
          4 Sesi
        </span>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Tarif Kursus (Rp)
        </label>
        <input
          type="number"
          min={0}
          step={1000}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(type, e.target.value)}
          placeholder="Contoh: 350000"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-[#1D3557] focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 tabular-nums transition-all"
        />
      </div>

      <div className="pt-1">
        <span className="text-[11px] font-semibold text-[#0077B6] tabular-nums block">
          {preview}
        </span>
      </div>
    </div>
  );
};
