import { Search } from 'lucide-react';

const pillSelectClass =
  'appearance-none rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all cursor-pointer';

interface PelatihFilterBarProps {
  q: string;
  onQChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

export default function PelatihFilterBar({
  q,
  onQChange,
  status,
  onStatusChange,
}: PelatihFilterBarProps) {
  return (
    <div className="anim-enter mb-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* Debounced Search Pill */}
      <div className="relative w-full sm:w-auto sm:min-w-[220px] sm:flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          placeholder="Cari nama atau no. telepon pelatih..."
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          aria-label="Cari pelatih"
          className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9.5 pr-4 text-xs font-medium text-[#1D3557] placeholder:text-slate-400 shadow-2xs hover:border-gray-300 focus:border-[#00B4D8] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 transition-all"
        />
      </div>

      {/* Filter Status */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter status pelatih"
          className={pillSelectClass}
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif Mengajar</option>
          <option value="nonaktif">Non-Aktif</option>
        </select>
      </div>
    </div>
  );
}
