export default function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <span className="text-slate-500">{label}</span>
      <b className="font-display block text-[26px] leading-[34px] font-bold text-primary">{value}</b>
    </div>
  );
}
