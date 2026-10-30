import { useParams } from 'react-router-dom';
import { assetUrl } from '../../lib/api/client';
import { RouteLoading } from '../../components/loading';
import PendaftaranRejectModal from './PendaftaranRejectModal';
import type { ServerRegistration } from '../../lib/api/types';
import { usePendaftaranDetail } from './usePendaftaranDetail';
import { PendaftaranDetailHeader } from './PendaftaranDetailHeader';
import { PendaftaranDetailOperational } from './PendaftaranDetailOperational';
import { PendaftaranDetailAttachments } from './PendaftaranDetailAttachments';
import { PendaftaranDetailSidebar } from './PendaftaranDetailSidebar';

export default function PendaftaranDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    detail,
    loading,
    actionLoading,
    showRejectModal,
    setShowRejectModal,
    handleApprove,
    handleRejectSubmit,
  } = usePendaftaranDetail(id);

  if (loading || !detail) {
    return <RouteLoading />;
  }

  const isInstructor = detail.type === 'NEW_INSTRUCTOR';
  const user = detail.user;
  const photo = assetUrl(user?.profilePictureUrl ?? detail.profilePictureUrl ?? undefined);
  const cvLink = assetUrl(detail.cvUrl ?? undefined);
  const paymentProofLink = assetUrl(detail.paymentProofUrl ?? undefined);

  const dummyTargetForModal: ServerRegistration = {
    id: detail.id,
    type: detail.type,
    status: detail.status,
    name: detail.name || user?.fullName || 'Pendaftar',
    email: detail.email || user?.email || null,
    phone: detail.phone || user?.phone || null,
    lokasi: detail.lokasi,
    birthDate: detail.birthDate,
    profilePictureUrl: detail.profilePictureUrl,
    cvUrl: detail.cvUrl,
    paymentProofUrl: detail.paymentProofUrl,
    rejectionReason: detail.rejectionReason,
  };

  return (
    <div className="space-y-6 pb-12">
      <PendaftaranDetailHeader
        detail={detail}
        isInstructor={isInstructor}
        actionLoading={actionLoading}
        onApprove={handleApprove}
        onOpenReject={() => setShowRejectModal(true)}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PendaftaranDetailOperational
            detail={detail}
            isInstructor={isInstructor}
            photo={photo}
          />
          <PendaftaranDetailAttachments
            detail={detail}
            isInstructor={isInstructor}
            cvLink={cvLink}
            paymentProofLink={paymentProofLink}
          />
        </div>

        <PendaftaranDetailSidebar
          detail={detail}
          isInstructor={isInstructor}
          actionLoading={actionLoading}
          onApprove={handleApprove}
          onOpenReject={() => setShowRejectModal(true)}
        />
      </div>

      {showRejectModal && (
        <PendaftaranRejectModal
          rejectTarget={dummyTargetForModal}
          saving={actionLoading}
          onClose={() => setShowRejectModal(false)}
          onConfirmReject={handleRejectSubmit}
        />
      )}
    </div>
  );
}
