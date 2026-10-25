import type { RefObject } from 'react';
import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { initials } from '../../../lib/format';
import type { SessionUser } from '../../../lib/auth';

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
  return (
    <div className="relative">
      <button
        ref={profileRef}
        type="button"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Menu profil"
        className="flex min-h-[44px] items-center gap-2 rounded-xl px-1.5 py-1 text-left transition-colors hover:bg-azure"
      >
        <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-azure font-display text-sm font-bold text-primary">
          {initials(user.nama)}
        </span>
        <span className="hidden min-w-0 max-w-[160px] min-[560px]:block">
          <span className="block truncate text-sm font-semibold text-ink">{user.nama}</span>
          <span className="block truncate text-xs text-slate-500">{roleLabel}</span>
        </span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div className="absolute right-0 z-20 mt-2 w-[300px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            <div className="px-3 py-2.5">
              <p className="m-0 truncate font-semibold text-ink">{user.nama}</p>
              {user.email && user.email !== user.nama ? (
                <p className="m-0 truncate text-[13px] text-slate-500">{user.email}</p>
              ) : null}
              <p className="mt-1 mb-0 text-xs font-semibold text-primary">
                {roleLabel}
                {user.lokasi ? ` · ${user.lokasi}` : ''}
              </p>
            </div>
            <div className="my-1 border-t border-gray-200" />
            <button
              type="button"
              onClick={onProfileClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-azure"
            >
              <UserCircle size={18} aria-hidden="true" className="text-slate-500" />
              Profil saya
            </button>
            <button
              type="button"
              onClick={onLogoutClick}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#B3341F] transition-colors hover:bg-[#FFE4DF]"
            >
              <LogOut size={18} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
