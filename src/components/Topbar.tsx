import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui';
import Modal from './Modal';
import { initials } from '../lib/format';
import { useAntrean, useResched } from '../lib/store';
import type { SessionUser } from '../lib/auth';

interface TopbarProps {
  user: SessionUser;
  onLogout: () => void;
}

type Menu = 'notif' | 'profile' | null;

export default function Topbar({ user, onLogout }: TopbarProps) {
  const admin = user.role === 'admin';
  const navigate = useNavigate();
  const antrean = useAntrean();
  const resched = useResched();
  const [menu, setMenu] = useState<Menu>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLButtonElement>(null);

  const pendingDaftar = admin ? antrean.length : antrean.filter((a) => a.lokasi === user.lokasi).length;
  const pendingJadwal = admin ? resched.length : 0;
  const total = pendingDaftar + pendingJadwal;

  useEffect(() => {
    if (!menu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(null);
        (menu === 'notif' ? bellRef : profileRef).current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menu]);

  function go(path: string) {
    setMenu(null);
    navigate(path);
  }

  function cancelLogout() {
    setConfirmLogout(false);
    profileRef.current?.focus();
  }

  function askLogout() {
    setMenu(null);
    setConfirmLogout(true);
  }

  const roleLabel = admin ? 'Admin Pusat' : 'Pengelola Kolam';
  const items =
    total === 0
      ? []
      : [
          ...(pendingDaftar > 0
            ? [{ key: 'daftar', label: `${pendingDaftar} pendaftaran menunggu persetujuan`, count: pendingDaftar, path: '/pendaftaran' }]
            : []),
          ...(pendingJadwal > 0
            ? [{ key: 'jadwal', label: `${pendingJadwal} request reschedule menunggu`, count: pendingJadwal, path: '/jadwal' }]
            : []),
        ];

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-end gap-1.5 border-b border-gray-200 bg-white/95 px-7 py-2 backdrop-blur max-[860px]:px-4">
        <div className="relative">
          <button
            ref={bellRef}
            type="button"
            onClick={() => setMenu((m) => (m === 'notif' ? null : 'notif'))}
            aria-haspopup="true"
            aria-expanded={menu === 'notif'}
            aria-label={total > 0 ? `${total} notifikasi baru` : 'Notifikasi'}
            title="Notifikasi"
            className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-xl text-slate-500 transition-colors hover:bg-azure hover:text-primary"
          >
            <Bell size={20} aria-hidden="true" />
            {total > 0 ? (
              <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#B3341F] px-1 text-[11px] font-bold text-white">
                {total}
              </span>
            ) : null}
          </button>
          {menu === 'notif' ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setMenu(null)}
                className="fixed inset-0 z-10 cursor-default bg-transparent"
              />
              <div className="absolute right-0 z-20 mt-2 w-[300px] max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                {items.length === 0 ? (
                  <p className="px-3 py-5 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</p>
                ) : (
                  items.map((it) => (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => go(it.path)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-azure"
                    >
                      <span className="flex-1">{it.label}</span>
                      <span className="rounded-full bg-[#B3341F] px-2 py-0.5 text-[11px] font-bold text-white">{it.count}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <button
            ref={profileRef}
            type="button"
            onClick={() => setMenu((m) => (m === 'profile' ? null : 'profile'))}
            aria-haspopup="true"
            aria-expanded={menu === 'profile'}
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
            <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-slate-500 transition-transform ${menu === 'profile' ? 'rotate-180' : ''}`} />
          </button>
          {menu === 'profile' ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => setMenu(null)}
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
                  onClick={() => go('/profil')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-azure"
                >
                  <UserCircle size={18} aria-hidden="true" className="text-slate-500" />
                  Profil saya
                </button>
                <button
                  type="button"
                  onClick={askLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#B3341F] transition-colors hover:bg-[#FFE4DF]"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Keluar
                </button>
              </div>
            </>
          ) : null}
        </div>
      </header>

      {confirmLogout ? (
        <Modal
          title="Keluar dari akun?"
          onClose={cancelLogout}
          footer={
            <>
              <Button variant="ghost" autoFocus onClick={cancelLogout}>
                Batal
              </Button>
              <Button variant="danger" onClick={onLogout}>
                Keluar
              </Button>
            </>
          }
        >
          <p className="text-sm text-slate-600">Kamu yakin ingin keluar dari sesi ini?</p>
        </Modal>
      ) : null}
    </>
  );
}
