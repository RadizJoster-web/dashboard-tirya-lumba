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
  title = 'Tren Pendaftaran',
  subtitle,
}: OverviewChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3.5 sm:p-6 shadow-2xs overflow-hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-[#1D3557]">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 font-normal">
            {subtitle ?? `${total} pendaftar baru terdaftar pada periode ini`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0FBFC] px-3 py-1 text-xs font-semibold text-[#0077B6] border border-[#00B4D8]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B4D8]" />
            Total: {total} Siswa
          </span>
        </div>
      </div>

      <ChartBar
        data={data}
        labels={labels}
        caption={`${title}, total ${total}`}
        height={220}
      />
    </div>
  );
}
