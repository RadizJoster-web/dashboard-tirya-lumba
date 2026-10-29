import { useMemo } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import { Button, RoleTag } from '../../components/ui';
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
      {
        key: 'name',
        header: 'Nama Kolam Renang',
        width: '32%',
        primary: true,
        render: (location) => (
          <div>
            <span className="font-bold text-[#1D3557] text-sm block">
              {location.name}
            </span>
          </div>
        ),
      },
      {
        key: 'category',
        header: 'Kategori Kerjasama',
        width: '20%',
        render: (location) => (
          <RoleTag role={location.category}>
            {location.category || 'Mitra Standar'}
          </RoleTag>
        ),
      },
      {
        key: 'mapUrl',
        header: 'Peta / Koordinat',
        width: '30%',
        render: (location) => {
          const isSafeUrl = Boolean(
            location.mapUrl && /^https?:\/\//i.test(location.mapUrl.trim()),
          );
          return isSafeUrl ? (
            <a
              href={location.mapUrl!}
              target="_blank"
              rel="noopener noreferrer"
              title={location.mapUrl!}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-[#0077B6] border border-gray-200 hover:bg-[#E0FBFC] hover:border-[#00B4D8] transition-colors"
            >
              <MapPin size={12} className="text-[#00B4D8]" />
              Buka Google Maps
              <ExternalLink size={11} className="text-slate-400" />
            </a>
          ) : (
            <span className="text-xs text-slate-400">-</span>
          );
        },
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '18%',
        asActions: true,
        render: (location) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(location)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
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
        emptyText="Belum ada lokasi kolam terdaftar di sistem."
      />
    );
  }

  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <section key={group.name} className="space-y-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display m-0 text-base font-bold text-[#1D3557]">
                {group.name}
              </h3>
              <span className="rounded-full bg-[#E0FBFC] px-2.5 py-0.5 text-xs font-semibold text-[#0077B6]">
                {group.items.length} Kolam
              </span>
            </div>
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
