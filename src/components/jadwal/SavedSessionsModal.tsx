import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Button } from '../ui';
import type { ServerSession } from '../../lib/api/types';
import { HARI } from '../../lib/format';

interface SavedSessionsModalProps {
  locationName: string;
  sessions: ServerSession[];
  onClose: () => void;
  onEdit: (session: ServerSession) => void;
  onDelete: (session: ServerSession) => void;
}

export default function SavedSessionsModal({ locationName, sessions, onClose, onEdit, onDelete }: SavedSessionsModalProps) {
  const ordered = [...sessions].sort((a, b) => {
    const dayDiff = HARI.indexOf(a.dayOfWeek) - HARI.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.sessionName.localeCompare(b.sessionName, 'id');
  });

  return (
    <Modal
      title="Edit jadwal tersimpan"
      onClose={onClose}
      wide
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Tutup</Button>
        </>
      }
    >
      <p className="mt-0 mb-3.5 text-sm text-slate-500">
        {locationName ? `Sesi yang sudah tersimpan di ${locationName}. ` : ''}Ubah jam atau hapus sesi yang tidak dipakai lagi.
      </p>
      <DataTable
        columns={[
          { key: 'sessionName', header: 'Sesi', width: '30%', primary: true },
          { key: 'dayOfWeek', header: 'Hari', width: '20%' },
          { key: 'time', header: 'Jam', width: '28%', render: (s) => `${s.startTime} - ${s.endTime}` },
          {
            key: 'aksi',
            header: 'Aksi',
            width: '22%',
            asActions: true,
            render: (s) => (
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => onEdit(s)}>
                  Edit
                </Button>
                <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => onDelete(s)}>
                  Hapus
                </Button>
              </div>
            ),
          },
        ]}
        rows={ordered}
        rowKey={(s) => s.id}
        emptyText="Belum ada sesi tersimpan untuk lokasi ini."
      />
    </Modal>
  );
}
