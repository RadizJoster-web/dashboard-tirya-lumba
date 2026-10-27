import { useMemo } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import { Button, RoleTag, StatusBadge } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerRegistration } from '../../lib/api/types';

interface PendaftaranTableProps {
  rows: ServerRegistration[];
  actionLoading?: boolean;
  onDetail: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (target: ServerRegistration) => void;
}

export default function PendaftaranTable({
  rows,
  actionLoading = false,
  onDetail,
  onApprove,
  onReject,
}: PendaftaranTableProps) {
  const columns = useMemo<DataTableColumn<ServerRegistration>[]>(
    () => [
      {
        key: 'name',
        header: 'Pendaftar',
        width: '32%',
        primary: true,
        render: (r) => {
          const photo = assetUrl(r.profilePictureUrl ?? undefined);
          return (
            <div className="flex items-center gap-3">
              {photo ? (
                <img
                  src={photo}
                  alt={r.name}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-gray-200"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-xs font-bold text-white shrink-0 shadow-2xs">
                  {r.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <span className="block font-semibold text-[#1D3557] truncate text-sm">
                  {r.name}
                </span>
                <span className="block text-xs text-slate-400 truncate">
                  {r.email ?? r.phone ?? 'Tidak ada kontak'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'type',
        header: 'Jenis',
        width: '15%',
        render: (r) => (
          <RoleTag role={r.type === 'NEW_INSTRUCTOR' ? 'instructor' : 'student'}>
            {r.type === 'NEW_INSTRUCTOR' ? 'Pelatih Baru' : 'Murid Baru'}
          </RoleTag>
        ),
      },
      {
        key: 'lokasi',
        header: 'Lokasi Kolam',
        width: '20%',
        render: (r) => (
          <span className="text-xs font-medium text-slate-600 line-clamp-2">
            {r.lokasi || 'Belum dipilih'}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status Verifikasi',
        width: '15%',
        render: (r) => <StatusBadge status={r.status ?? 'PENDING'} />,
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '18%',
        asActions: true,
        render: (r) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDetail(r.id)}
            >
              Tinjau Detail
            </Button>
            {onApprove && (
              <Button
                variant="primary"
                size="sm"
                disabled={actionLoading}
                onClick={() => onApprove(r.id)}
                title="Setujui pendaftaran"
                className="hidden xl:inline-flex"
              >
                Setujui
              </Button>
            )}
            {onReject && (
              <Button
                variant="danger"
                size="sm"
                disabled={actionLoading}
                onClick={() => onReject(r)}
                title="Tolak pendaftaran"
                className="hidden xl:inline-flex"
              >
                Tolak
              </Button>
            )}
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
      emptyText="Tidak ada antrean pendaftaran yang menunggu persetujuan."
    />
  );
}
