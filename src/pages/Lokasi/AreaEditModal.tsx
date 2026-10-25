import type { FormEvent } from 'react';
import Modal from '../../components/ui/Modal';
import { Button, Field } from '../../components/ui';
import type { ServerArea } from '../../lib/api/types';

interface AreaEditModalProps {
  area: ServerArea | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string) => Promise<boolean>;
}

export default function AreaEditModal({
  area,
  saving,
  onClose,
  onSubmit,
}: AreaEditModalProps) {
  if (!area) return null;

  return (
    <Modal title="Edit Nama Area / Kota" onClose={onClose}>
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const name = String(fd.get('name') ?? '').trim();
          const ok = await onSubmit(area.id, name);
          if (ok) {
            onClose();
          }
        }}
        className="grid gap-1"
      >
        <Field
          label="Nama Area / Kota"
          name="name"
          defaultValue={area.name}
          placeholder="Contoh: Tangerang Selatan"
          required
          minLength={2}
          maxLength={50}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Menyimpan…' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
