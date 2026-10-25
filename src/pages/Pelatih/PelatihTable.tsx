import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import type { DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui';
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
        header: 'Nama',
        width: '40%',
        primary: true,
        render: (r) => (
          <span className="font-medium text-slate-800 truncate">{r.fullName}</span>
        ),
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
