import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerRegistration, ServerRegistrationDetail } from '../../lib/api/types';

const fetchRegistrations = (): Promise<ServerRegistration[]> =>
  apiGet<ServerRegistration[]>('/register?status=PENDING');

export function usePendaftaranData() {
  const { data, loading: isLoading, reload } = useResource(
    '/register?status=PENDING',
    fetchRegistrations,
  );

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<ServerRegistrationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const registrations = useMemo(() => data ?? [], [data]);

  async function openDetail(id: string) {
    setDetailId(id);
    setDetailLoading(true);
    try {
      const detail = await apiGet<ServerRegistrationDetail>(`/register/${id}`);
      setDetailData(detail);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal memuat detail pendaftaran.',
        { style: { color: '#B3341F' } },
      );
      setDetailId(null);
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetailId(null);
    setDetailData(null);
  }

  async function approveRegistration(id: string): Promise<boolean> {
    setActionLoading(true);
    try {
      await apiSend(`/register/${id}/approve`, 'POST');
      toast.success('Pendaftaran berhasil disetujui.');
      await reload();
      closeDetail();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyetujui pendaftaran.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  async function rejectRegistration(id: string, rejectionReason: string): Promise<boolean> {
    setActionLoading(true);
    try {
      await apiSend(`/register/${id}/reject`, 'POST', { rejectionReason });
      toast.error('Pendaftaran ditolak.', {
        style: { color: '#B3341F' },
      });
      await reload();
      closeDetail();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menolak pendaftaran.',
        { style: { color: '#B3341F' } },
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  return {
    registrations,
    isLoading,
    detailId,
    detailData,
    detailLoading,
    actionLoading,
    openDetail,
    closeDetail,
    approveRegistration,
    rejectRegistration,
    reload,
  };
}
