import { useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import {
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  Menu,
  ShieldCheck,
  Trophy,
  UserCircle,
  UserPlus,
  Wallet,
} from 'lucide-react';
import type { SessionUser } from '../../../lib/auth';
import { MobileNavDrawer, type MoreItem } from './MobileNavDrawer';

interface MobileBottomNavProps {
  user: SessionUser | null;
  pending: number;
}

export default function MobileBottomNav({ user, pending }: MobileBottomNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const isOverview = !!useMatch({ path: '/overview', end: true });
  const isPendaftaran = !!useMatch({ path: '/pendaftaran', end: true });
  const isSiswa = !!useMatch({ path: '/siswa', end: true });
  const isAbsen = !!useMatch({ path: '/absen', end: true });
  const isProfil = !!useMatch({ path: '/profil', end: true });

  const isMoreActive =
    !isOverview && !isPendaftaran && !isSiswa && !isAbsen && !isProfil;

  const moreItems: MoreItem[] = [
    { path: '/pelatih', label: 'Data Pelatih', icon: Trophy },
    ...(isAdmin
      ? [
          { path: '/jadwal', label: 'Jadwal & Sesi', icon: CalendarDays },
          { path: '/lokasi', label: 'Master Lokasi', icon: MapPin },
          { path: '/paket', label: 'Harga & Paket', icon: Wallet },
          { path: '/pengelola', label: 'Akun Pengelola', icon: ShieldCheck },
        ]
      : []),
    { path: '/profil', label: 'Profil Saya', icon: UserCircle },
  ];

  return (
    <>
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white/95 px-2 py-1 shadow-lg backdrop-blur-md min-[861px]:hidden anim-enter"
      >
        <Link
          to="/overview"
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isOverview ? 'text-[#0077B6] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard size={20} strokeWidth={isOverview ? 2.4 : 1.8} />
          <span className="mt-1 text-[10px]">Overview</span>
        </Link>

        <Link
          to="/pendaftaran"
          className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isPendaftaran ? 'text-[#0077B6] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <UserPlus size={20} strokeWidth={isPendaftaran ? 2.4 : 1.8} />
            {pending > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF6F59] px-1 text-[9px] font-bold text-white shadow-2xs">
                {pending}
              </span>
            )}
          </div>
          <span className="mt-1 text-[10px]">Antrean</span>
        </Link>

        <Link
          to="/siswa"
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isSiswa ? 'text-[#0077B6] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <GraduationCap size={20} strokeWidth={isSiswa ? 2.4 : 1.8} />
          <span className="mt-1 text-[10px]">Siswa</span>
        </Link>

        <Link
          to="/absen"
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors ${
            isAbsen ? 'text-[#0077B6] font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardCheck size={20} strokeWidth={isAbsen ? 2.4 : 1.8} />
          <span className="mt-1 text-[10px]">Presensi</span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            isMoreActive || drawerOpen
              ? 'text-[#0077B6] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Menu size={20} strokeWidth={isMoreActive || drawerOpen ? 2.4 : 1.8} />
          <span className="mt-1 text-[10px]">Menu</span>
        </button>
      </nav>

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAdmin={isAdmin}
        items={moreItems}
      />
    </>
  );
}
