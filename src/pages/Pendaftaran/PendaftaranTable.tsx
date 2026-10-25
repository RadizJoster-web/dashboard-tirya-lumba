import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import type { DataTableColumn } from '../../components/ui/DataTable';
import { Button } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerRegistration } from '../../lib/api/types';

interface PendaftaranTableProps {
  rows: ServerRegistration[];
  actionLoading: boolean;
  onDetail: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (target: ServerRegistration) => void;
}

export default function PendaftaranTable({
  rows,
  actionLoading,
  onDetail,
  onApprove,
  onReject,
}: PendaftaranTableProps) {
  const columns = useMemo<DataTableColumn<ServerRegistration>[]>(
    () => [
      {
        key: 'name',
        header: 'Nama Pendaftar',
        width: '26%',
        primary: true,
        render: (r) => {
          const photo = assetUrl(r.profilePictureUrl ?? undefined);
          return (
            <div className="flex items-center gap-2.5">
              {photo ? (
                <img
                  src={photo}
                  alt={r.name}
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-azure text-xs font-bold text-primary shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-ink truncate">{r.name}</span>
            </div>
          );
        },
      },
      {
        key: 'email',
        header: 'Kontak',
        width: '24%',
        render: (r) => (
          <div className="text-xs">
            <p className="font-medium text-slate-700 truncate">{r.email ?? '-'}</p>
            <p className="text-slate-400 truncate">{r.phone ?? '-'}</p>
          </div>
        ),
      },
      {
        key: 'lokasi',
        header: 'Lokasi Kolam',
        width: '20%',
        render: (r) => (
          <span className="text-xs font-medium text-slate-600 line-clamp-2">
            {r.lokasi || '-'}
          </span>
        ),
      },
      {
        key: 'type',
        header: 'Tipe',
        width: '12%',
        render: (r) => (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              r.type === 'NEW_INSTRUCTOR'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {r.type === 'NEW_INSTRUCTOR' ? 'Pelatih' : 'Murid'}
          </span>
        ),
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '18%',
        asActions: true,
        render: (r) => (
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="ghost"
              className="px-2.5 py-1 text-xs min-h-0"
              onClick={() => onDetail(r.id)}
            >
              Detail
            </Button>
            <Button
              variant="primary"
              className="px-2.5 py-1 text-xs min-h-0"
              disabled={actionLoading}
              onClick={() => onApprove(r.id)}
            >
              ACC
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs min-h-0"
              disabled={actionLoading}
              onClick={() => onReject(r)}
            >
              Tolak
            </Button>
          </div>
        ),
      },
    ],
    [onDetail, onApprove, onReject, actionLoading],
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      emptyText="Belum ada pendaftar baru yang menunggu persetujuan."
    />
  );
}
