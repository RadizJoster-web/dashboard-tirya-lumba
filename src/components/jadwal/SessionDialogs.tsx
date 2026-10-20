import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import { Button, Field } from '../ui';
import { HARI } from '../../lib/format';
import type { ServerSession } from '../../lib/api/types';
import { inputClass } from './session-templates';

interface SessionDialogsProps {
  editTarget: ServerSession | null;
  deleteTarget: ServerSession | null;
  saving: boolean;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSaveEdit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

export default function SessionDialogs({
  editTarget,
  deleteTarget,
  saving,
  onCloseEdit,
  onCloseDelete,
  onSaveEdit,
  onDelete,
}: SessionDialogsProps) {
  return (
    <>
      {editTarget ? (
        <Modal title="Edit sesi" onClose={onCloseEdit}>
          <form onSubmit={onSaveEdit} className="grid gap-1">
            <Field label="Nama sesi" name="sessionName" defaultValue={editTarget.sessionName} required />
            <label className="mb-3 block font-semibold">
              Hari
              <select name="dayOfWeek" defaultValue={editTarget.dayOfWeek} className={inputClass}>
                {HARI.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Jam mulai" name="startTime" type="time" defaultValue={editTarget.startTime} required />
              <Field label="Jam selesai" name="endTime" type="time" defaultValue={editTarget.endTime} required />
            </div>
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={onCloseEdit}>Batal</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Hapus sesi?"
          onClose={onCloseDelete}
          footer={
            <>
              <Button variant="ghost" onClick={onCloseDelete}>Batal</Button>
              <Button variant="danger" onClick={onDelete} disabled={saving}>
                {saving ? 'Menghapus…' : 'Hapus'}
              </Button>
            </>
          }
        >
          <p className="mb-3.5">
            Sesi <b>{deleteTarget.sessionName}</b> hari <b>{deleteTarget.dayOfWeek}</b> ({deleteTarget.startTime} - {deleteTarget.endTime}) akan dihapus.
          </p>
        </Modal>
      ) : null}
    </>
  );
}
