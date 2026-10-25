import Modal from '../../components/ui/Modal';
import { SkeletonDetail } from '../../components/loading';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import { initials } from '../../lib/format';
import type { ServerInstructorDetail } from '../../lib/api/types';

interface PelatihDetailModalProps {
  isOpen: boolean;
  detail: ServerInstructorDetail | null;
  detailLoading: boolean;
  detailError: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export default function PelatihDetailModal({
  isOpen,
  detail,
  detailLoading,
  detailError,
  onClose,
  onRetry,
}: PelatihDetailModalProps) {
  if (!isOpen) return null;

  const profile = detail?.instructorProfile;
  const detailPhoto = assetUrl(detail?.profilePictureUrl);
  const locations = profile?.locations ?? [];

  return (
    <Modal title="Detail pelatih" onClose={onClose} footer={<Button variant="ghost" onClick={onClose}>Tutup</Button>}>
      {detailLoading || (!detail && !detailError) ? (
        <SkeletonDetail />
      ) : detailError ? (
        <div className="text-sm">
          <p className="m-0 text-[#B3341F]">{detailError}</p>
          <Button variant="ghost" className="mt-3 px-2.5 py-1 text-[13px]" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : detail ? (
        <>
          <div className="mb-4 flex items-center gap-3">
            {detailPhoto ? (
              <img src={detailPhoto} alt={`Foto ${detail.fullName}`} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
                {initials(detail.fullName)}
              </span>
            )}
            <div className="min-w-0">
              <b className="block truncate">{detail.fullName}</b>
              <p className="m-0 truncate text-slate-500">{detail.email ?? '-'}</p>
            </div>
          </div>
          <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 text-sm sm:grid-cols-[120px_1fr]">
            <dt className="text-slate-500">Telepon</dt>
            <dd className="m-0">{detail.phone ?? '-'}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="m-0"><StatusBadge active={detail.isActive} /></dd>
            <dt className="text-slate-500">Verifikasi</dt>
            <dd className="m-0">{detail.isVerified ? 'Terverifikasi' : 'Belum terverifikasi'}</dd>
            <dt className="text-slate-500">Lisensi</dt>
            <dd className="m-0">{profile?.license ?? '-'}</dd>
            <dt className="text-slate-500">Pengalaman</dt>
            <dd className="m-0">{profile?.experience ?? '-'}</dd>
            <dt className="text-slate-500">Bio</dt>
            <dd className="m-0">{profile?.shortBio ?? '-'}</dd>
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="m-0">
              {locations.length === 0
                ? '-'
                : locations.map((l) => `${l.name}${l.area?.name ? ` (${l.area.name})` : ''}`).join(', ')}
            </dd>
          </dl>
        </>
      ) : null}
    </Modal>
  );
}
