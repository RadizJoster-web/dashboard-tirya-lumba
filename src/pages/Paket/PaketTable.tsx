import DataTable from '../../components/ui/DataTable';
import { formatRp } from '../../lib/format';
import type { ServerPackage } from '../../lib/api/types';

interface PaketTableProps {
  currentPackages: ServerPackage[];
}

export default function PaketTable({ currentPackages }: PaketTableProps) {
  return (
    <section className="mt-5">
      <h3 className="mb-2.5 text-lg font-bold">Paket terdaftar</h3>
      <DataTable
        columns={[
          { key: 'type', header: 'Tipe', width: '50%', primary: true },
          {
            key: 'price',
            header: 'Harga',
            width: '50%',
            render: (item) => formatRp(item.price),
          },
        ]}
        rows={currentPackages}
        rowKey={(item) => item.id}
        emptyText="Belum ada paket terdaftar untuk lokasi ini."
      />
    </section>
  );
}
