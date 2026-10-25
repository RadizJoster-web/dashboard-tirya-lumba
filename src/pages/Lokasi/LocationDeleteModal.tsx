import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import type { ServerLocation } from '../../lib/api/types';

interface LocationDeleteModalProps {
  deleteTarget: ServerLocation | null;
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LocationDeleteModal({
  deleteTarget,
  saving,
  onClose,
  onConfirm,
}: LocationDeleteModalProps) {
  if (!deleteTarget) return null;

  return (
    <Modal
      title="Hapus lokasi?"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button variant="danger" onClick={onConfirm} disabled={saving}>
            {saving ? 'Menghapus…' : 'Hapus'}
          </Button>
        </>
      }
    >
      <p className="mb-3.5">
        <b>{deleteTarget.name}</b> akan dihapus dari daftar lokasi. Tindakan ini tidak bisa dibatalkan.
      </p>
    </Modal>
  );
}
