import Modal from '../../components/ui/Modal';
import { Button, RoleTag } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { initials } from '../../lib/format';
import type { ServerPoolManager } from '../../lib/api/types';

interface PengelolaDetailModalProps {
  detail: ServerPoolManager | null;
  locationName: Map<string, string>;
  onClose: () => void;
}

export default function PengelolaDetailModal({
  detail,
  locationName,
  onClose,
}: PengelolaDetailModalProps) {
  if (!detail) return null;

  const locName =
    detail.location?.name ??
    (detail.locationId ? locationName.get(detail.locationId) ?? '-' : '-');

  return (
    <Modal
      title="Detail Pengelola Kolam"
      onClose={onClose}
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 rounded-xl border border-gray-100 bg-slate-50/80 p-4">
          <span
            aria-hidden="true"
            className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] font-display text-lg font-bold text-white shadow-2xs shrink-0"
          >
            {initials(detail.fullName)}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-base text-[#1D3557] truncate">
              {detail.fullName}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">{detail.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <RoleTag role="pool_manager">Pengelola Kolam</RoleTag>
              <StatusBadge active={detail.isActive} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">No. Telepon</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block">
              {detail.phone ?? '-'}
            </span>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Kolam Dikelola</span>
            <span className="font-bold text-[#0077B6] mt-0.5 block truncate">
              {locName}
            </span>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Status Akun</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block">
              {detail.isActive ? 'Aktif' : 'Non-Aktif'}
            </span>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Verifikasi</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block">
              {detail.isVerified ? 'Terverifikasi' : 'Belum'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
