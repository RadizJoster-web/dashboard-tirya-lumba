import Modal from '../../components/ui/Modal';
import { Button, RoleTag, StatusBadge } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerRegistrationDetail } from '../../lib/api/types';
import {
  RegistrationModalInstructorView,
  RegistrationModalStudentView,
} from './RegistrationModalViews';

interface PendaftaranDetailModalProps {
  detail: ServerRegistrationDetail | null;
  isLoading: boolean;
  actionLoading: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function PendaftaranDetailModal({
  detail,
  isLoading,
  actionLoading,
  onClose,
  onApprove,
  onReject,
}: PendaftaranDetailModalProps) {
  if (!detail && !isLoading) return null;

  if (isLoading || !detail) {
    return (
      <Modal title="Detail Pendaftaran" onClose={onClose}>
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#00B4D8] border-t-transparent" />
        </div>
      </Modal>
    );
  }

  const isInstructor = detail.type === 'NEW_INSTRUCTOR';
  const user = detail.user;
  const photo = assetUrl(user?.profilePictureUrl ?? detail.profilePictureUrl ?? undefined);
  const cvLink = assetUrl(detail.cvUrl ?? undefined);
  const paymentProofLink = assetUrl(detail.paymentProofUrl ?? undefined);

  return (
    <Modal
      wide
      title={isInstructor ? 'Detail Pendaftaran Pelatih' : 'Detail Pendaftaran Murid'}
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={actionLoading}>
            Tutup
          </Button>
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => onReject(detail.id)}
              disabled={actionLoading}
            >
              Tolak
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onApprove(detail.id)}
              disabled={actionLoading}
            >
              {actionLoading ? 'Memproses…' : 'Setujui Pendaftaran'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3.5 rounded-xl bg-slate-50/80 p-4 border border-gray-100">
          {photo ? (
            <img
              src={photo}
              alt={detail.name}
              className="h-14 w-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-lg font-bold text-white shadow-2xs">
              {detail.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-display font-bold text-base text-[#1D3557] truncate">
              {detail.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">{detail.email ?? '-'}</p>
            <div className="mt-1 flex items-center gap-2">
              <RoleTag role={isInstructor ? 'instructor' : 'student'}>
                {isInstructor ? 'Calon Pelatih' : 'Calon Murid'}
              </RoleTag>
              <StatusBadge status={detail.status} />
            </div>
          </div>
        </div>

        {isInstructor ? (
          <RegistrationModalInstructorView detail={detail} cvLink={cvLink} />
        ) : (
          <RegistrationModalStudentView detail={detail} paymentProofLink={paymentProofLink} />
        )}
      </div>
    </Modal>
  );
}
