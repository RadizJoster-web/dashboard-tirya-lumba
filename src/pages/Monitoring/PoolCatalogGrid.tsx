import React from 'react';
import { Search, Filter, Waves } from 'lucide-react';
import { PoolCard } from './PoolCard';
import type { PoolCapacityItem } from '../../lib/api/types';

interface PoolCatalogGridProps {
  pools: PoolCapacityItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: 'ALL' | 'OPEN' | 'CLOSED';
  onStatusFilterChange: (status: 'ALL' | 'OPEN' | 'CLOSED') => void;
  onSelectPool: (id: string) => void;
}

export const PoolCatalogGrid: React.FC<PoolCatalogGridProps> = ({
  pools,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSelectPool,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama kolam renang atau area..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-slate-50/50 text-[#1D3557] placeholder:text-slate-400 focus:bg-white focus:border-[#0077B6] focus:outline-hidden transition-colors"
          />
        </div>

        {/* Status Filter Segmented Button */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-200 bg-slate-50 p-1 text-xs">
          <Filter size={13} className="text-slate-400 ml-1.5 mr-0.5 shrink-0" />
          <button
            type="button"
            onClick={() => onStatusFilterChange('ALL')}
            className={`rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white text-[#1D3557] shadow-2xs'
                : 'text-slate-500 hover:text-[#1D3557]'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('OPEN')}
            className={`rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer ${
              statusFilter === 'OPEN'
                ? 'bg-emerald-50 text-emerald-700 shadow-2xs'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            Buka
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('CLOSED')}
            className={`rounded-md px-2.5 py-1 font-semibold transition-all cursor-pointer ${
              statusFilter === 'CLOSED'
                ? 'bg-rose-50 text-rose-700 shadow-2xs'
                : 'text-slate-500 hover:text-rose-700'
            }`}
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Grid Katalog Kolam */}
      {pools.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <Waves size={24} />
          </div>
          <h4 className="font-display font-bold text-sm text-[#1D3557]">
            Tidak ada kolam yang cocok
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Coba ubah kata kunci pencarian atau ganti filter status pendaftaran di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pools.map((p) => (
            <PoolCard key={p.id} pool={p} onSelect={onSelectPool} />
          ))}
        </div>
      )}
    </div>
  );
};
