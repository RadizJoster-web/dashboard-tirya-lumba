import {
  SkeletonPage,
  SkeletonHeader,
  SkeletonStats,
  SkeletonTable,
} from '../../components/loading';
import { RefreshCw, Activity } from 'lucide-react';
import { useMonitoringData } from './useMonitoringData';
import { MonitoringGlobalStats } from './MonitoringGlobalStats';
import { PoolCatalogGrid } from './PoolCatalogGrid';
import { PoolDrillDownView } from './PoolDrillDownView';

export default function Monitoring() {
  const {
    loading,
    globalStats,
    pools,
    filteredPools,
    selectedPool,
    setSelectedPoolId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    togglingId,
    handleToggleCoachStatus,
    reload,
  } = useMonitoringData();

  if (loading && pools.length === 0) {
    return (
      <SkeletonPage label="Memuat monitoring kuota kolam">
        <SkeletonHeader />
        <SkeletonStats count={4} />
        <SkeletonTable rows={4} cols={3} />
      </SkeletonPage>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Halaman Monitoring */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#0077B6]">
              <Activity size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
              Monitoring Kuota &amp; Alokasi Pelatih
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Analisis beban kerja pelatih dan jumlah murid untuk mengontrol pembukaan pendaftaran pelatih baru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => reload()}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Segarkan Data
        </button>
      </div>

      {/* Level 1: Header Metrik Global */}
      <MonitoringGlobalStats
        totalInstructors={globalStats.totalActiveInstructors}
        totalStudents={globalStats.totalActiveStudents}
        totalPools={pools.length}
      />

      {/* Level 2 (Katalog) atau Level 3 (Drill-Down) */}
      {selectedPool ? (
        <PoolDrillDownView
          pool={selectedPool}
          onBack={() => setSelectedPoolId(null)}
          onToggleCoachStatus={handleToggleCoachStatus}
          isToggling={togglingId === selectedPool.id}
        />
      ) : (
        <PoolCatalogGrid
          pools={filteredPools}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSelectPool={(id) => setSelectedPoolId(id)}
        />
      )}
    </div>
  );
}
