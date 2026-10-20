interface ChartBarProps {
  data: number[];
  labels: string[];
  caption: string;
}

export default function ChartBar({ data, labels, caption }: ChartBarProps) {
  const max = Math.max(...data, 1);
  return (
    <div role="img" aria-label={caption} className="flex h-[190px] items-end gap-2 pt-2.5">
      {data.map((v, i) => (
        <div key={labels[i]} title={`${v} pendaftar`} className="flex h-full flex-1 flex-col items-center justify-end gap-1 text-xs text-slate-500">
          <span>{v}</span>
          <i className="block w-full max-w-[38px] rounded-t-md bg-aqua transition-all hover:bg-primary" style={{ height: `${(v / max) * 130}px` }} />
          <span>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
