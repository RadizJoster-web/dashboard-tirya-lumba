import type { ReactNode } from 'react';

export function RoleTag({ children }: { children: ReactNode }) {
  return (
    <span className="bg-azure text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
      {children}
    </span>
  );
}
