import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { assetUrl } from '../../lib/api/client';
import { initials } from '../../lib/format';
import type { ServerSiswa } from '../../lib/api/types';

interface SiswaDetailModalProps {
  detail: ServerSiswa | null;
  onClose: () => void;
}

export default function SiswaDetailModal({ detail, onClose }: SiswaDetailModalProps) {
  if (!detail) return null;

  const photo = assetUrl(detail.profilePictureUrl ?? detail.fotoUrl);

  return (
    <Modal title="Detail siswa" onClose={onClose} footer={<Button variant="ghost" onClick={onClose}>Tutup</Button>}>
      <div className="mb-4 flex items-center gap-3">
        {photo ? (
          <img src={photo} alt={`Foto ${detail.nama}`} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
            {initials(detail.nama)}
          </span>
        )}
        <div className="min-w-0">
          <b className="block truncate">{detail.nama}</b>
          <p className="m-0 truncate text-slate-500">{detail.lokasi}</p>
        </div>
      </div>
      <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 sm:grid-cols-[120px_1fr]">
        <dt className="text-slate-500">Usia</dt>
        <dd className="m-0">{detail.usia} tahun</dd>
        <dt className="text-slate-500">Telepon</dt>
        <dd className="m-0">{detail.telp || '-'}</dd>
        <dt className="text-slate-500">Lokasi</dt>
        <dd className="m-0">{detail.lokasi}</dd>
        <dt className="text-slate-500">Paket</dt>
        <dd className="m-0">{detail.paket}</dd>
        <dt className="text-slate-500">Berlaku s/d</dt>
        <dd className="m-0">{detail.berlakuSd}</dd>
        <dt className="text-slate-500">Status</dt>
        <dd className="m-0"><StatusBadge active={detail.aktif} /></dd>
      </dl>
    </Modal>
  );
}
