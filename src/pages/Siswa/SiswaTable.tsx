import { useMemo } from 'react';
import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { Button, RoleTag } from '../../components/ui';
import { assetUrl } from '../../lib/api/client';
import type { ServerSiswa } from '../../lib/api/types';

interface SiswaTableProps {
  rows: ServerSiswa[];
  onSelectDetail: (id: string) => void;
}

export default function SiswaTable({ rows, onSelectDetail }: SiswaTableProps) {
  const columns = useMemo<DataTableColumn<ServerSiswa>[]>(
    () => [
      {
        key: 'nama',
        header: 'Murid / Siswa',
        width: '30%',
        primary: true,
        render: (r) => {
          const photo = assetUrl(r.profilePictureUrl ?? r.fotoUrl);
          return (
            <div className="flex items-center gap-3">
              {photo ? (
                <img
                  src={photo}
                  alt={r.nama}
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-gray-200"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] text-xs font-bold text-white shrink-0 shadow-2xs">
                  {r.nama.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <span className="block font-semibold text-[#1D3557] truncate text-sm">
                  {r.nama}
                </span>
                <span className="block text-xs text-slate-400 truncate">
                  {r.usia ? `${r.usia} thn` : ''} {r.telp ? `• ${r.telp}` : ''}
                </span>
              </div>
            </div>
          );
        },
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
        key: 'paket',
        header: 'Paket Kursus',
        width: '18%',
        render: (r) => (
          <div>
            <RoleTag role="student">{r.paket || 'Reguler'}</RoleTag>
            {r.berlakuSd && (
              <span className="block text-[11px] text-slate-400 mt-1 tabular-nums">
                s/d {r.berlakuSd}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'aktif',
        header: 'Status Paket',
        width: '16%',
        render: (r) => <StatusBadge active={r.aktif} />,
      },
      {
        key: 'aksi',
        header: 'Aksi',
        width: '16%',
        asActions: true,
        render: (r) => (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectDetail(r.id)}
            >
              Detail Siswa
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
      emptyText="Belum ada data siswa yang cocok dengan filter pencarian."
    />
  );
}
