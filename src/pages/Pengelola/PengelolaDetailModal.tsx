import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
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

  return (
    <Modal title="Detail pengelola" onClose={onClose} footer={<Button variant="ghost" onClick={onClose}>Tutup</Button>}>
      <div className="mb-3.5 flex items-center gap-3">
        <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
          {initials(detail.fullName)}
        </span>
        <div className="min-w-0">
          <b className="block truncate">{detail.fullName}</b>
          <p className="m-0 truncate text-slate-500">{detail.email}</p>
        </div>
      </div>
      <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2">
        <dt className="text-slate-500">No. telepon</dt>
        <dd className="m-0">{detail.phone ?? '-'}</dd>
        <dt className="text-slate-500">Lokasi</dt>
        <dd className="m-0">{detail.location?.name ?? (detail.locationId ? locationName.get(detail.locationId) ?? '-' : '-')}</dd>
        <dt className="text-slate-500">Status</dt>
        <dd className="m-0">{detail.isActive ? 'Aktif' : 'Non-Aktif'}</dd>
        <dt className="text-slate-500">Terverifikasi</dt>
        <dd className="m-0">{detail.isVerified ? 'Ya' : 'Belum'}</dd>
      </dl>
    </Modal>
  );
}
