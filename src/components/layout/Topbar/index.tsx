import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import type { SessionUser } from '../../../lib/auth';
import ProfileMenu from './ProfileMenu';
import LogoutModal from './LogoutModal';

interface TopbarProps {
  user: SessionUser;
  onLogout: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/overview': 'Dashboard Overview',
  '/pendaftaran': 'Antrean Pendaftaran',
  '/siswa': 'Data Siswa & Murid',
  '/pelatih': 'Data Guru & Pelatih',
  '/absen': 'Presensi Operasional',
  '/jadwal': 'Penjadwalan & Sesi Kolam',
  '/lokasi': 'Master Wilayah & Lokasi',
  '/paket': 'Master Paket Kursus',
  '/pengelola': 'Manajemen Pengelola Kolam',
  '/profil': 'Profil Pengguna',
};

export default function Topbar({ user, onLogout }: TopbarProps) {
  const admin = user.role === 'admin';
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const profileRef = useRef<HTMLButtonElement>(null);

  const currentTitle = ROUTE_TITLES[location.pathname] ?? 'Dashboard';

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

  const roleLabel = admin ? 'Super Admin' : 'Pengelola Kolam';

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-6 lg:px-8 py-3 backdrop-blur-md">
        {/* Left: Active Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg lg:text-xl font-bold text-[#1D3557] tracking-tight">
            {currentTitle}
          </h1>
          {!admin && user.lokasi && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-[#E0FBFC] px-2.5 py-0.5 text-xs font-semibold text-[#0077B6] border border-[#00B4D8]/20">
              {user.lokasi}
            </span>
          )}
        </div>

        {/* Right: Quick actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick search display shortcut */}
          <div className="relative hidden md:block">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              readOnly
              placeholder="Search..."
              onClick={() => {
                if (location.pathname !== '/siswa' && location.pathname !== '/pelatih') {
                  navigate('/siswa');
                }
              }}
              className="h-8.5 w-44 lg:w-56 rounded-full border border-gray-200 bg-slate-50/70 pl-8.5 pr-3 text-xs text-slate-600 placeholder:text-slate-400 cursor-pointer hover:border-gray-300 focus:outline-none transition-all"
            />
          </div>

          {/* Clean notification bell placeholder */}
          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => navigate('/pendaftaran')}
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 hover:text-[#0077B6] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Bell size={16} strokeWidth={1.8} />
          </button>

          {/* Profile Menu Trigger */}
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
        </div>
      </header>

      <LogoutModal
        isOpen={confirmLogout}
        onClose={cancelLogout}
        onConfirm={onLogout}
      />
    </>
  );
}
