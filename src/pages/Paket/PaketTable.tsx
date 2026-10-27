import DataTable, { type DataTableColumn } from '../../components/ui/DataTable';
import { RoleTag } from '../../components/ui';
import { formatRp } from '../../lib/format';
import type { ServerPackage } from '../../lib/api/types';

interface PaketTableProps {
  currentPackages: ServerPackage[];
}

export default function PaketTable({ currentPackages }: PaketTableProps) {
  const columns: DataTableColumn<ServerPackage>[] = [
    {
      key: 'type',
      header: 'Kategori Paket Kursus',
      width: '40%',
      primary: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <RoleTag role="student">{item.type}</RoleTag>
        </div>
      ),
    },
    {
      key: 'sessions',
      header: 'Jumlah Pertemuan / Sesi',
      width: '30%',
      render: (item) => {
        const count = item.sessionCount ?? 4;
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E0FBFC] px-2.5 py-0.5 text-xs font-bold text-[#0077B6] tabular-nums">
            {count} Pertemuan
          </span>
        );
      },
    },
    {
      key: 'price',
      header: 'Biaya / Tarif Kursus',
      width: '30%',
      render: (item) => (
        <span className="font-bold text-[#1D3557] tabular-nums text-sm">
          {formatRp(item.price)}
        </span>
      ),
    },
  ];

  return (
    <section className="mt-6 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display text-base font-bold text-[#1D3557]">
          Daftar Paket Terdaftar untuk Lokasi Terpilih
        </h3>
        <span className="text-xs text-slate-400">
          {currentPackages.length} paket aktif
        </span>
      </div>
      <DataTable
        columns={columns}
        rows={currentPackages}
        rowKey={(item) => item.id}
        emptyText="Belum ada paket terdaftar untuk lokasi kolam ini."
      />
    </section>
  );
}
