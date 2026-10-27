import type { RefObject } from 'react';
import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { initials } from '../../../lib/format';
import type { SessionUser } from '../../../lib/auth';
import { RoleTag } from '../../ui';

interface ProfileMenuProps {
  user: SessionUser;
  profileRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  roleLabel: string;
  onToggle: () => void;
  onClose: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

export default function ProfileMenu({
  user,
  profileRef,
  isOpen,
  roleLabel,
  onToggle,
  onClose,
  onProfileClick,
  onLogoutClick,
}: ProfileMenuProps) {
  const isAdmin = user.role === 'admin';

  return (
    <div className="relative">
      <button
        ref={profileRef}
        type="button"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Menu profil"
        className="flex min-h-[38px] items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-left transition-all hover:border-gray-300 hover:shadow-2xs cursor-pointer"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-xs font-bold text-white"
        >
          {initials(user.nama)}
        </span>
        <span className="hidden min-w-0 max-w-[130px] min-[640px]:block">
          <span className="block truncate text-xs font-semibold text-[#1D3557]">
            {user.nama}
          </span>
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-30 cursor-default bg-transparent"
          />
          <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2.5">
              <p className="m-0 truncate text-sm font-bold text-[#1D3557]">
                {user.nama}
              </p>
              {user.email && user.email !== user.nama && (
                <p className="m-0 truncate text-xs text-slate-400">
                  {user.email}
                </p>
              )}
              <div className="mt-2 flex items-center gap-1.5">
                <RoleTag role={isAdmin ? 'ADMIN' : 'POOL_MANAGER'}>
                  {roleLabel}
                </RoleTag>
              </div>
            </div>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={onProfileClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0077B6] cursor-pointer"
            >
              <UserCircle size={16} aria-hidden="true" className="text-slate-400" />
              Profil Akun
            </button>
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#FF6F59] transition-colors hover:bg-[#FFE4DF]/60 cursor-pointer"
            >
              <LogOut size={16} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
