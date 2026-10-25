import ChartBar from '../../components/ui/ChartBar';

interface OverviewChartProps {
  data: number[];
  labels: string[];
  total: number;
}

export default function OverviewChart({ data, labels, total }: OverviewChartProps) {
  return (
    <div className="mt-3.5 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-base">Tren pendaftaran 2026</h3>
      <p className="text-slate-500">{total} pendaftar baru</p>
      <ChartBar data={data} labels={labels} caption={`Pendaftaran per bulan tahun 2026, total ${total}`} />
    </div>
  );
}
