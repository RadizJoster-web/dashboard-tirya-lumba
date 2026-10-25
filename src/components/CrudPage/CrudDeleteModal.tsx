import Modal from '../ui/Modal';
import { Button } from '../ui';

interface CrudDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CrudDeleteModal({ isOpen, onClose, onConfirm }: CrudDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title="Hapus data?"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Hapus
          </Button>
        </>
      }
    >
      <p className="mb-3.5">Data yang dihapus tidak bisa dikembalikan.</p>
    </Modal>
  );
}
