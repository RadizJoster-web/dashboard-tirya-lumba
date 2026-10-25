import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import type { DataTableColumn } from '../../components/ui/DataTable';
import { Button } from '../../components/ui';
import type { ServerLocation } from '../../lib/api/types';

interface LocationGroup {
  name: string;
  items: ServerLocation[];
}

interface LocationGroupListProps {
  groups: LocationGroup[];
  onEdit: (location: ServerLocation) => void;
  onDelete: (location: ServerLocation) => void;
}

export default function LocationGroupList({
  groups,
  onEdit,
  onDelete,
}: LocationGroupListProps) {
  const columns = useMemo<DataTableColumn<ServerLocation>[]>(
    () => [
      { key: 'name', header: 'Nama', width: '28%', primary: true },
      { key: 'category', header: 'Kategori', width: '16%' },
      {
        key: 'mapUrl',
        header: 'Map URL',
        width: '34%',
        render: (location) =>
          location.mapUrl ? (
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noreferrer"
              title={location.mapUrl}
              className="block max-w-full truncate text-primary underline underline-offset-2"
            >
              {location.mapUrl}
            </a>
          ) : (
            '-'
          ),
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '22%',
        asActions: true,
        render: (location) => (
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="ghost"
              className="px-2.5 py-1 text-[13px]"
              onClick={() => onEdit(location)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-[13px]"
              onClick={() => onDelete(location)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  if (groups.length === 0) {
    return (
      <DataTable
        columns={columns}
        rows={[]}
        rowKey={(l) => l.id}
        emptyText="Belum ada lokasi kolam terdaftar."
      />
    );
  }

  return (
    <div className="grid gap-5">
      {groups.map((group) => (
        <section key={group.name}>
          <div className="mb-2.5 flex flex-wrap items-baseline gap-2">
            <h3 className="m-0 text-lg font-bold">{group.name}</h3>
            <span className="text-sm text-slate-500">
              {group.items.length} lokasi
            </span>
          </div>
          <DataTable
            columns={columns}
            rows={group.items}
            rowKey={(l) => l.id}
          />
        </section>
      ))}
    </div>
  );
}
