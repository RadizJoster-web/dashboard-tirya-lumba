import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import type { DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui';
import type { ServerSiswa } from '../../lib/api/types';

interface SiswaTableProps {
  rows: ServerSiswa[];
  onSelectDetail: (id: string) => void;
}

export default function SiswaTable({ rows, onSelectDetail }: SiswaTableProps) {
  const columns = useMemo<DataTableColumn<ServerSiswa>[]>(
    () => [
      { key: 'nama', header: 'Nama', width: '26%', primary: true },
      {
        key: 'usia',
        header: 'Usia',
        width: '10%',
        render: (r) => `${r.usia} thn`,
      },
      { key: 'lokasi', header: 'Lokasi', width: '22%' },
      { key: 'berlakuSd', header: 'Berlaku s/d', width: '16%' },
      {
        key: 'aktif',
        header: 'Status',
        width: '12%',
        render: (r) => <StatusBadge active={r.aktif} />,
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '14%',
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
      emptyText="Belum ada siswa yang cocok dengan filter."
    />
  );
}
