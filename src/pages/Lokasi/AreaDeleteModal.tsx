import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import type { ServerArea } from '../../lib/api/types';

interface AreaDeleteModalProps {
  area: ServerArea | null;
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AreaDeleteModal({
  area,
  saving,
  onClose,
  onConfirm,
}: AreaDeleteModalProps) {
  if (!area) return null;

  const locationCount = area._count?.locations ?? 0;
  const hasLinkedLocations = locationCount > 0;

  return (
    <Modal
      title="Hapus Area / Kota?"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={saving || hasLinkedLocations}
          >
            {saving ? 'Menghapus…' : 'Hapus'}
          </Button>
        </>
      }
    >
      <p className="mb-3">
        Area <b>{area.name}</b> akan dihapus dari daftar master area.
      </p>

      {hasLinkedLocations ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-[#B3341F]">
          Area ini masih terikat dengan <b>{locationCount} lokasi kolam renang</b>. Hapus atau pindahkan lokasi kolam tersebut terlebih dahulu sebelum menghapus area ini.
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Tindakan ini tidak bisa dibatalkan jika area belum memiliki keterikatan data.
        </p>
      )}
    </Modal>
  );
}
