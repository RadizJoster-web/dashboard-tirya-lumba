import { useMemo } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button, RoleTag } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import { initials } from '../../lib/format';
import type { ServerInstructor } from '../../lib/api/types';

interface PelatihTableProps {
  rows: ServerInstructor[];
  onSelectDetail: (id: string) => void;
}

export default function PelatihTable({
  rows,
  onSelectDetail,
}: PelatihTableProps) {
  const columns = useMemo<DataTableColumn<ServerInstructor>[]>(
    () => [
      {
        key: 'fullName',
        header: 'Instruktur / Pelatih',
        width: '38%',
        primary: true,
        render: (r) => {
          const photo = assetUrl(r.profilePictureUrl);
          return (
            <div className="flex items-center gap-3">
              {photo ? (
                <img
                  src={photo}
                  alt={r.fullName}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-gray-200"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#6B21A8] to-[#A855F7] text-xs font-bold text-white shrink-0 shadow-2xs">
                  {initials(r.fullName)}
                </div>
              )}
              <div className="min-w-0">
                <span className="block font-semibold text-[#1D3557] truncate text-sm">
                  {r.fullName}
                </span>
                <span className="block text-xs text-slate-400 truncate">
                  Pelatih Renang Berlisensi
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'phone',
        header: 'Kontak',
        width: '24%',
        render: (r) => (
          <div className="text-xs">
            <span className="font-medium text-[#1D3557] block">{r.phone || '-'}</span>
            <RoleTag role="instructor">Pelatih</RoleTag>
          </div>
        ),
      },
      {
        key: 'isActive',
        header: 'Status Mengajar',
        width: '20%',
        render: (r) => <StatusBadge active={r.isActive} />,
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '18%',
        asActions: true,
        render: (r) => (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectDetail(r.id)}
            >
              Detail Profil
            </Button>
          </div>
        ),
      },
    ],
    [onSelectDetail],
  );

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      emptyText="Belum ada pelatih yang cocok dengan filter pencarian."
    />
  );
}
