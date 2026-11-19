import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { PoolCapacityData } from '../../lib/api/types';

const fetchPoolCapacity = (): Promise<PoolCapacityData> =>
  apiGet<PoolCapacityData>('/monitoring/pool-capacity');

export function useMonitoringData() {
  const { data, loading, reload } = useResource(
    '/monitoring/pool-capacity',
    fetchPoolCapacity,
  );

  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const globalStats = data?.globalStats ?? {
    totalActiveInstructors: 0,
    totalActiveStudents: 0,
  };

  const pools = data?.pools ?? [];
  const selectedPool = pools.find((p) => p.id === selectedPoolId) ?? null;

  const filteredPools = pools.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.areaName && p.areaName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'OPEN') return p.isCoachRegistrationOpen;
    if (statusFilter === 'CLOSED') return !p.isCoachRegistrationOpen;
    return true;
  });

  const handleToggleCoachStatus = useCallback(
    async (poolId: string, currentStatus: boolean) => {
      setTogglingId(poolId);
      try {
        const nextStatus = !currentStatus;
        await apiSend(
          `/monitoring/locations/${poolId}/toggle-coach-registration`,
          'PATCH',
          { isCoachRegistrationOpen: nextStatus },
        );
        toast.success(
          `Pendaftaran pelatih berhasil diubah menjadi ${
            nextStatus ? 'BUKA' : 'TUTUP'
          }!`,
        );
        await reload();
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Gagal memperbarui status kolam.',
        );
      } finally {
        setTogglingId(null);
      }
    },
    [reload],
  );

  return {
    loading,
    globalStats,
    pools,
    filteredPools,
    selectedPool,
    selectedPoolId,
    setSelectedPoolId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    togglingId,
    handleToggleCoachStatus,
    reload,
  };
}
