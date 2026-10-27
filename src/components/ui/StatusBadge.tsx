export type StatusType =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'Hadir'
  | 'Tidak Hadir'
  | 'Aktif'
  | 'Non-Aktif'
  | string;

interface StatusBadgeProps {
  active?: boolean;
  status?: StatusType;
  label?: string;
  className?: string;
}

export default function StatusBadge({
  active,
  status,
  label,
  className = '',
}: StatusBadgeProps) {
  // Determine canonical status
  let resolvedStatus = status;
  if (resolvedStatus === undefined && active !== undefined) {
    resolvedStatus = active ? 'Aktif' : 'Non-Aktif';
  }

  const normalized = (resolvedStatus ?? '').toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200/60';
  let dotColor = 'bg-slate-400';

  if (
    normalized === 'aktif' ||
    normalized === 'active' ||
    normalized === 'approved' ||
    normalized === 'hadir'
  ) {
    colorClasses = 'bg-[#DCFCE7] text-[#166534] border-emerald-200/60';
    dotColor = 'bg-[#16A34A]';
  } else if (normalized === 'pending' || normalized === 'menunggu') {
    colorClasses = 'bg-[#FEF3C7] text-[#92400E] border-amber-200/60';
    dotColor = 'bg-[#D97706]';
  } else if (
    normalized === 'non-aktif' ||
    normalized === 'inactive' ||
    normalized === 'rejected' ||
    normalized === 'ditolak' ||
    normalized === 'tidak hadir'
  ) {
    colorClasses = 'bg-[#FFE4DF] text-[#C93B2B] border-[#FF6F59]/30';
    dotColor = 'bg-[#FF6F59]';
  } else if (normalized === 'paid' || normalized === 'lunas') {
    colorClasses = 'bg-[#E0FBFC] text-[#0077B6] border-[#00B4D8]/30';
    dotColor = 'bg-[#00B4D8]';
  }

  const displayLabel = label ?? resolvedStatus ?? (active ? 'Aktif' : 'Non-Aktif');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors ${colorClasses} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} shrink-0`} />
      <span>{displayLabel}</span>
    </span>
  );
}
