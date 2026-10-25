import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SessionUser } from '../../../lib/auth';
import ProfileMenu from './ProfileMenu';
import LogoutModal from './LogoutModal';

interface TopbarProps {
  user: SessionUser;
  onLogout: () => void;
}

export default function Topbar({ user, onLogout }: TopbarProps) {
  const admin = user.role === 'admin';
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const profileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        profileRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [profileOpen]);

  function go(path: string) {
    setProfileOpen(false);
    navigate(path);
  }

  function cancelLogout() {
    setConfirmLogout(false);
    profileRef.current?.focus();
  }

  function askLogout() {
    setProfileOpen(false);
    setConfirmLogout(true);
  }

  const roleLabel = admin ? 'Admin Pusat' : 'Pengelola Kolam';

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-end gap-1.5 border-b border-gray-200 bg-white/95 px-7 py-2 backdrop-blur max-[860px]:px-4">
        <ProfileMenu
          user={user}
          profileRef={profileRef}
          isOpen={profileOpen}
          roleLabel={roleLabel}
          onToggle={() => setProfileOpen((prev) => !prev)}
          onClose={() => setProfileOpen(false)}
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
