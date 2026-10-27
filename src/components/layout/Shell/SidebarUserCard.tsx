import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import type { SessionUser } from '../../../lib/auth';
import { RoleTag } from '../../ui';

interface SidebarUserCardProps {
  user: SessionUser | null;
  collapsed?: boolean;
  onLogout?: () => void;
}

export default function SidebarUserCard({ user, collapsed = false, onLogout }: SidebarUserCardProps) {
  const initials = user?.nama
    ? user.nama
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const isAdmin = user?.role === 'admin';

  if (collapsed) {
    return (
      <div className="mt-auto hidden flex-col items-center gap-2 pt-3 border-t border-gray-100 min-[861px]:flex">
        <Link
          to="/profil"
          title={`${user?.nama ?? 'Pengguna'} (${isAdmin ? 'Admin' : 'Pengelola'})`}
          className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-xs font-bold text-white shadow-2xs hover:scale-105 transition-transform"
        >
          {initials}
        </Link>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Keluar dari akun"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#FFE4DF] hover:text-[#FF6F59] cursor-pointer"
          >
            <LogOut size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-auto hidden flex-col gap-2 pt-4 border-t border-gray-100 min-[861px]:flex">
      <div className="flex flex-col gap-2.5 rounded-xl border border-gray-200 bg-slate-50/80 p-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-xs font-bold text-white shadow-2xs"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-xs font-bold text-[#1D3557]">
              {user?.nama ?? 'Pengguna'}
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              {user?.email ?? user?.username ?? '-'}
            </span>
          </div>
        </div>

        {/* Role & Location scoping tag */}
        <div className="flex flex-col gap-1 pt-1 border-t border-gray-200/60">
          <div className="flex items-center justify-between gap-1">
            <RoleTag role={isAdmin ? 'ADMIN' : 'POOL_MANAGER'}>
              {isAdmin ? 'Super Admin' : 'Pengelola Kolam'}
            </RoleTag>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Keluar dari akun"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-[#FFE4DF] hover:text-[#FF6F59] cursor-pointer"
              >
                <LogOut size={14} aria-hidden="true" />
              </button>
            )}
          </div>
          {!isAdmin && user?.lokasi && (
            <span className="text-[11px] font-medium text-slate-500 truncate" title={user.lokasi}>
              📍 {user.lokasi}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
