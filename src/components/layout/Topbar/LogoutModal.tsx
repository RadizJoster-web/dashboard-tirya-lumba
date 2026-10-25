import Modal from '../../ui/Modal';
import { Button } from '../../ui';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      title="Keluar dari akun?"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" autoFocus onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Keluar
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">Kamu yakin ingin keluar dari sesi ini?</p>
    </Modal>
  );
}
