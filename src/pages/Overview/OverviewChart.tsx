import ChartBar from '../../components/ui/ChartBar';

interface OverviewChartProps {
  data: number[];
  labels: string[];
  total: number;
  title?: string;
  subtitle?: string;
}

export default function OverviewChart({
  data,
  labels,
  total,
  title = 'Tren pendaftaran 2026',
  subtitle,
}: OverviewChartProps) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle ?? `${total} pendaftar baru terdaftar`}
          </p>
        </div>
        <span className="rounded-full bg-azure px-3 py-1 text-xs font-semibold text-primary">
          Total: {total} Siswa
        </span>
      </div>
      <ChartBar
        data={data}
        labels={labels}
        caption={`${title}, total ${total}`}
      />
    </div>
  );
}
