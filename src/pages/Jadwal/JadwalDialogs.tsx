import type { FormEvent } from 'react';
import SavedSessionsModal from '../../components/jadwal/SavedSessionsModal';
import SessionDialogs from '../../components/jadwal/SessionDialogs';
import type { ServerSession } from '../../lib/api/types';

interface JadwalDialogsProps {
  savedOpen: boolean;
  locationName: string;
  sessions: ServerSession[];
  editTarget: ServerSession | null;
  deleteTarget: ServerSession | null;
  saving: boolean;
  onCloseSaved: () => void;
  onSelectEdit: (session: ServerSession) => void;
  onSelectDelete: (session: ServerSession) => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onSaveEdit: (e: FormEvent<HTMLFormElement>) => void;
  onDeleteSession: () => void;
}

export default function JadwalDialogs({
  savedOpen,
  locationName,
  sessions,
  editTarget,
  deleteTarget,
  saving,
  onCloseSaved,
  onSelectEdit,
  onSelectDelete,
  onCloseEdit,
  onCloseDelete,
  onSaveEdit,
  onDeleteSession,
}: JadwalDialogsProps) {
  return (
    <>
      {savedOpen ? (
        <SavedSessionsModal
          locationName={locationName}
          sessions={sessions}
          onClose={onCloseSaved}
          onEdit={(session) => {
            onCloseSaved();
            onSelectEdit(session);
          }}
          onDelete={(session) => {
            onCloseSaved();
            onSelectDelete(session);
          }}
        />
      ) : null}

      <SessionDialogs
        editTarget={editTarget}
        deleteTarget={deleteTarget}
        saving={saving}
        onCloseEdit={onCloseEdit}
        onCloseDelete={onCloseDelete}
        onSaveEdit={onSaveEdit}
        onDelete={onDeleteSession}
      />
    </>
  );
}
