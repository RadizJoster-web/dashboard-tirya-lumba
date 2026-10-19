import type { ReactNode } from 'react';

function Bar({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none ${className}`} />;
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
        <Bar className="h-6 w-3/4 rounded-lg" />
        <Bar className="mt-2 h-3.5 w-full" />
      </div>
      {action ? <Bar className="h-11 w-32 rounded-lg" /> : null}
    </div>
  );
}

export function SkeletonFilters({ fields = 3 }: { fields?: number }) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2.5">
      <Bar className="h-11 min-w-[180px] flex-1 rounded-lg" />
      {Array.from({ length: Math.max(0, fields - 1) }).map((_, i) => (
        <Bar key={i} className="h-11 w-[150px] rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols }: { rows?: number; cols: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex gap-4 border-b border-gray-200 bg-basedash px-3.5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Bar key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-gray-200 px-3.5 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Bar key={c} className={`h-3.5 flex-1 ${c === 0 ? 'max-w-[180px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 3 }: { count?: number }) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="min-w-[160px] rounded-lg border border-gray-200 bg-white p-4">
          <Bar className="h-3.5 w-24" />
          <Bar className="mt-2.5 h-7 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  const heights = [36, 52, 44, 68, 58, 80, 62, 92, 74, 88, 66, 96];
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Bar className="h-4 w-40" />
      <Bar className="mt-2 h-3.5 w-28" />
      <div className="mt-4 flex h-[190px] items-end gap-2">
        {heights.map((h, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="w-full animate-pulse rounded-t-md bg-slate-200 motion-reduce:animate-none"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[960px]:[grid-template-columns:280px_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 py-6">
        <Bar className="h-24 w-24 rounded-full" />
        <Bar className="h-4 w-36" />
        <Bar className="h-5 w-24 rounded-full" />
        <Bar className="h-11 w-32 rounded-lg" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <Bar className="mb-4 h-4 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-gray-200 py-3.5 last:border-0">
            <Bar className="h-3.5 w-32" />
            <Bar className="h-3.5 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div aria-hidden="true">
      <div className="mb-4 flex items-center gap-3">
        <Bar className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Bar className="h-4 w-40" />
          <Bar className="mt-2 h-3.5 w-28" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 border-b border-gray-200 py-2.5 last:border-0">
          <Bar className="h-3.5 w-24" />
          <Bar className="h-3.5 w-48" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <Bar className="h-4 w-36" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            <Bar className="h-3.5 w-24" />
            <Bar className="mt-2 h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <Bar className="mt-4 h-11 w-32 rounded-lg" />
    </div>
  );
}
