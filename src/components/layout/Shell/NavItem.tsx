import { Link, useMatch } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  Trophy,
  UserCircle,
  UserPlus,
  Wallet,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  '/overview': LayoutDashboard,
  '/pendaftaran': UserPlus,
  '/jadwal': CalendarDays,
  '/lokasi': MapPin,
  '/paket': Wallet,
  '/absen': ClipboardCheck,
  '/siswa': GraduationCap,
  '/pelatih': Trophy,
  '/pengelola': ShieldCheck,
  '/profil': UserCircle,
};

const LABELS: Record<string, string> = {
  '/overview': 'Overview',
  '/pendaftaran': 'Pendaftaran',
  '/jadwal': 'Jadwal & Sesi',
  '/lokasi': 'Lokasi',
  '/paket': 'Harga & Paket',
  '/absen': 'Absensi',
  '/siswa': 'Siswa',
  '/pelatih': 'Pelatih',
  '/pengelola': 'Pengelola',
  '/profil': 'Profil',
};

interface NavItemProps {
  path: string;
  pending: number;
}

export default function NavItem({ path, pending }: NavItemProps) {
  const Icon = ICONS[path] ?? LayoutDashboard;
  const match = useMatch({ path, end: true });
  const isActive = !!match;

  return (
    <Link
      to={path}
      className={`relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 no-underline transition-colors duration-300 ease-in-out max-[860px]:whitespace-nowrap ${
        isActive ? 'bg-azure font-semibold text-primary' : 'text-slate-500 hover:bg-azure hover:text-primary'
      }`}
    >
      {isActive ? (
        <span aria-hidden="true" className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-full bg-primary max-[860px]:hidden" />
      ) : null}
      <Icon size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <span className="flex-1 whitespace-nowrap">{LABELS[path]}</span>
      {path === '/pendaftaran' && pending > 0 ? (
        <span className="ml-auto rounded-full bg-[#B3341F] px-2 py-0.5 text-[11px] font-bold text-white">{pending}</span>
      ) : null}
    </Link>
  );
}
