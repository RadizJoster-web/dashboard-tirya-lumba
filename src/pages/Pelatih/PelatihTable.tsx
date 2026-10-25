import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import type { DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerInstructor } from '../../lib/api/types';
import { initials } from '../../lib/format';

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
        header: 'Nama',
        width: '40%',
        primary: true,
        render: (r) => {
          const photo = assetUrl(r.profilePictureUrl);
          return (
            <div className="flex items-center gap-2.5">
              {photo ? (
                <img
                  src={photo}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-azure text-xs font-bold text-primary"
                >
                  {initials(r.fullName)}
                </span>
              )}
              <span className="min-w-0 truncate">{r.fullName}</span>
            </div>
          );
        },
      },
      {
        key: 'phone',
        header: 'Telepon',
        width: '22%',
        render: (r) => r.phone ?? '-',
      },
      {
        key: 'isActive',
        header: 'Status',
        width: '18%',
        render: (r) => <StatusBadge active={r.isActive} />,
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '20%',
        asActions: true,
        render: (r) => (
          <Button
            variant="ghost"
            className="px-2.5 py-1 text-[13px]"
            onClick={() => onSelectDetail(r.id)}
          >
            Detail
          </Button>
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
      emptyText="Belum ada pelatih yang cocok."
    />
  );
}
