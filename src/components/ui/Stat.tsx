import type { ReactNode } from 'react';

export interface StatProps {
  label: string;
  value: string | number;
  subtitle?: string;
  badge?: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

export default function Stat({
  label,
  value,
  subtitle,
  badge,
  variant = 'default',
  className = '',
}: StatProps) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5.5 transition-all duration-200 flex-1 min-w-[220px] ${
        isPrimary
          ? 'bg-gradient-to-br from-[#1D3557] via-[#143B64] to-[#0077B6] text-white shadow-md shadow-[#0077B6]/10'
          : 'bg-white border border-gray-200 text-[#1D3557] shadow-2xs hover:border-gray-300'
      } ${className}`}
    >
      {/* Subtle background glow for primary variant */}
      {isPrimary && (
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none"
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-semibold tracking-wider uppercase ${
            isPrimary ? 'text-white/75' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {badge && <div>{badge}</div>}
      </div>

      <div className="mt-2.5">
        <b
          className={`font-display block text-3xl lg:text-[34px] leading-tight font-extrabold tracking-tight tabular-nums ${
            isPrimary ? 'text-white' : 'text-[#1D3557]'
          }`}
        >
          {value}
        </b>
      </div>

      {subtitle && (
        <p
          className={`mt-2 text-xs font-medium ${
            isPrimary ? 'text-white/70' : 'text-slate-400'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
