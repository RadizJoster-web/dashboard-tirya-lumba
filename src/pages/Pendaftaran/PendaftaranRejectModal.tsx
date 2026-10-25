import { useState } from 'react';
import type { FormEvent } from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui';
import type { ServerRegistration } from '../../lib/api/types';

interface PendaftaranRejectModalProps {
  rejectTarget: ServerRegistration | null;
  saving: boolean;
  onClose: () => void;
  onConfirmReject: (alasan: string) => void;
}

export default function PendaftaranRejectModal({
  rejectTarget,
  saving,
  onClose,
  onConfirmReject,
}: PendaftaranRejectModalProps) {
  const [rejectError, setRejectError] = useState('');

  if (!rejectTarget) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const alasan = String(
      new FormData(e.currentTarget).get('alasan') ?? '',
    ).trim();
    if (!alasan || alasan.length < 3) {
      setRejectError('Alasan penolakan minimal 3 karakter.');
      return;
    }
    setRejectError('');
    onConfirmReject(alasan);
  }

  function handleClose() {
    setRejectError('');
    onClose();
  }

  return (
    <Modal title={`Tolak Pendaftaran: ${rejectTarget.name}`} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="grid gap-1">
        <label className="mb-3 block font-semibold text-sm text-ink">
          Alasan Penolakan
          <textarea
            name="alasan"
            rows={3}
            required
            minLength={3}
            placeholder="Contoh: Berkas CV belum sesuai, lisensi kadaluarsa, atau jadwal bentrok..."
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-sm transition-all focus:border-aqua focus:ring-2 focus:ring-aqua/40 focus:outline-none"
          />
        </label>
        {rejectError ? (
          <span className="mb-2 block text-[13px] font-medium text-[#B3341F]">
            {rejectError}
          </span>
        ) : null}
        <div className="mt-1.5 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={saving}>
            Batal
          </Button>
          <Button type="submit" variant="danger" disabled={saving}>
            {saving ? 'Menolak…' : 'Tolak Pendaftaran'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
