import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiGet, apiSend } from '../../lib/api/client';
import type { ServerRegistrationDetail } from '../../lib/api/types';

export function usePendaftaranDetail(id: string | undefined) {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ServerRegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    let active = true;
    if (!id) return;

    setLoading(true);
    apiGet<ServerRegistrationDetail>(`/register/${id}`)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : 'Gagal memuat detail pendaftaran.',
          );
          navigate('/pendaftaran');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  const handleApprove = async () => {
    if (!detail) return;
    const isInstructor = detail.type === 'NEW_INSTRUCTOR';
    setActionLoading(true);
    try {
      await apiSend(`/register/${detail.id}/approve`, 'POST');
      toast.success(
        `Pendaftaran ${isInstructor ? 'pelatih' : 'murid'} berhasil disetujui.`,
      );
      setDetail((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menyetujui pendaftaran.',
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (!detail) return;
    setActionLoading(true);
    try {
      await apiSend(`/register/${detail.id}/reject`, 'POST', {
        rejectionReason: reason,
      });
      toast.error('Pendaftaran telah ditolak.');
      setDetail((prev) =>
        prev
          ? { ...prev, status: 'REJECTED', rejectionReason: reason }
          : null,
      );
      setShowRejectModal(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menolak pendaftaran.',
      );
    } finally {
      setActionLoading(false);
    }
  };

  return {
    detail,
    loading,
    actionLoading,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectSubmit,
  };
}
