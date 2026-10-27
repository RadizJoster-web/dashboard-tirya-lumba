import type { ReactNode } from 'react';

export function SkeletonBar({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-200/80 motion-reduce:animate-none ${className}`} />;
}

export function SkeletonPage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function SkeletonHeader({ action = false }: { action?: boolean }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="w-full max-w-[280px]">
        <SkeletonBar className="h-6 w-3/4 rounded-lg" />
        <SkeletonBar className="mt-2 h-3.5 w-full" />
      </div>
      {action ? <SkeletonBar className="h-10 w-32 rounded-lg" /> : null}
    </div>
  );
}

export function SkeletonFilters({ fields = 3 }: { fields?: number }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2.5">
      <SkeletonBar className="h-9 min-w-[200px] flex-1 rounded-full" />
      {Array.from({ length: Math.max(0, fields - 1) }).map((_, i) => (
        <SkeletonBar key={i} className="h-9 w-[140px] rounded-full" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols }: { rows?: number; cols: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs">
      <div className="flex gap-4 border-b border-gray-100 bg-slate-50/70 px-4 py-3.5">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBar key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-gray-100 px-4 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBar key={c} className={`h-3.5 flex-1 ${c === 0 ? 'max-w-[180px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 3 }: { count?: number }) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5.5 shadow-2xs">
          <SkeletonBar className="h-3.5 w-24" />
          <SkeletonBar className="mt-3 h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
