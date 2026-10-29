import { Search } from 'lucide-react';
import { AGE_RANGES } from './types';

const pillSelectClass =
  'appearance-none rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all cursor-pointer';

interface SiswaFilterBarProps {
  q: string;
  onQChange: (v: string) => void;
  usia: string;
  onUsiaChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  admin: boolean;
  lokasi: string;
  onLokasiChange: (v: string) => void;
  locationOptions: string[];
}

export default function SiswaFilterBar({
  q,
  onQChange,
  usia,
  onUsiaChange,
  status,
  onStatusChange,
  admin,
  lokasi,
  onLokasiChange,
  locationOptions,
}: SiswaFilterBarProps) {
  return (
    <div className="anim-enter mb-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* Debounced Search Pill */}
      <div className="relative w-full sm:w-auto sm:min-w-[220px] sm:flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          placeholder="Cari nama atau kontak siswa..."
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          aria-label="Cari nama siswa"
          className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9.5 pr-4 text-xs font-medium text-[#1D3557] placeholder:text-slate-400 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all"
        />
      </div>

      {/* Filter Usia */}
      <div className="relative">
        <select
          value={usia}
          onChange={(e) => onUsiaChange(e.target.value)}
          aria-label="Filter usia"
          className={pillSelectClass}
        >
          <option value="">Semua Usia</option>
          {AGE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Status */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter status"
          className={pillSelectClass}
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Non-Aktif</option>
        </select>
      </div>

      {/* Filter Lokasi (Admin Only) */}
      {admin ? (
        <div className="relative">
          <select
            value={lokasi}
            onChange={(e) => onLokasiChange(e.target.value)}
            aria-label="Filter lokasi"
            className={pillSelectClass}
          >
            <option value="">Semua Kolam Cabang</option>
            {locationOptions.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
