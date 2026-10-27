import { Phone } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { SkeletonDetail } from '../../components/loading';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button, RoleTag } from '../../components/ui';
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
    <Modal
      title="Detail Profil Pelatih"
      onClose={onClose}
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      {detailLoading || (!detail && !detailError) ? (
        <SkeletonDetail />
      ) : detailError ? (
        <div className="text-sm">
          <p className="m-0 text-[#FF6F59]">{detailError}</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={onRetry}>
            Coba lagi
          </Button>
        </div>
      ) : detail ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-slate-50/80 p-4">
            {detailPhoto ? (
              <img
                src={detailPhoto}
                alt={`Foto ${detail.fullName}`}
                className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-2xs shrink-0"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#A855F7] font-display text-xl font-bold text-white shadow-2xs shrink-0"
              >
                {initials(detail.fullName)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-bold text-base text-[#1D3557] truncate">
                {detail.fullName}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{detail.email ?? '-'}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge active={detail.isActive} />
                {detail.phone && (
                  <a
                    href={`https://wa.me/${detail.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    <Phone size={11} />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
              <span className="text-slate-400 font-semibold block uppercase">Lisensi</span>
              <span className="font-semibold text-[#1D3557] mt-0.5 block">
                {profile?.license ?? 'Tidak ada lisensi'}
              </span>
            </div>

            <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
              <span className="text-slate-400 font-semibold block uppercase">Pengalaman</span>
              <span className="font-semibold text-[#1D3557] mt-0.5 block">
                {profile?.experience ?? '-'}
              </span>
            </div>
          </div>

          {profile?.shortBio && (
            <div className="rounded-lg border border-gray-100 bg-slate-50 p-3 text-xs">
              <span className="text-slate-400 font-semibold block uppercase mb-1">
                Bio Profil
              </span>
              <p className="text-[#1D3557] italic leading-relaxed">
                "{profile.shortBio}"
              </p>
            </div>
          )}

          {locations.length > 0 && (
            <div className="rounded-lg border border-gray-100 bg-slate-50 p-3 text-xs">
              <span className="text-slate-400 font-semibold block uppercase mb-2">
                Lokasi Kolam Mengajar ({locations.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {locations.map((l) => (
                  <RoleTag key={l.id} role="pool_manager">
                    {l.name}
                  </RoleTag>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
