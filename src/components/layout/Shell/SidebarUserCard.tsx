import type { SessionUser } from '../../../lib/auth';

interface SidebarUserCardProps {
  user: SessionUser | null;
}

export default function SidebarUserCard({ user }: SidebarUserCardProps) {
  const initials = user?.nama
    ? user.nama
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="mt-auto hidden flex-col gap-2 pt-4 min-[861px]:flex">
      <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-2.5 py-2">
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-azure font-display text-sm font-bold text-primary">
          {initials}
        </span>
        <span className="min-w-0 flex-1 whitespace-nowrap">
          <span className="block truncate text-sm font-semibold">{user?.nama ?? '-'}</span>
          <span className="block text-xs text-slate-500">{user?.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</span>
        </span>
      </div>
    </div>
  );
}
