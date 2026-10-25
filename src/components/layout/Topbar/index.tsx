import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAntrean } from '../../../lib/local/registration-queue';
import { useResched } from '../../../lib/local/reschedule-requests';
import type { SessionUser } from '../../../lib/auth';
import NotificationMenu from './NotificationMenu';
import type { NotificationItem } from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import LogoutModal from './LogoutModal';

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
  const items: NotificationItem[] =
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
        <NotificationMenu
          bellRef={bellRef}
          isOpen={menu === 'notif'}
          total={total}
          items={items}
          onToggle={() => setMenu((m) => (m === 'notif' ? null : 'notif'))}
          onClose={() => setMenu(null)}
          onSelect={go}
        />

        <ProfileMenu
          user={user}
          profileRef={profileRef}
          isOpen={menu === 'profile'}
          roleLabel={roleLabel}
          onToggle={() => setMenu((m) => (m === 'profile' ? null : 'profile'))}
          onClose={() => setMenu(null)}
          onProfileClick={() => go('/profil')}
          onLogoutClick={askLogout}
        />
      </header>

      <LogoutModal
        isOpen={confirmLogout}
        onClose={cancelLogout}
        onConfirm={onLogout}
      />
    </>
  );
}
