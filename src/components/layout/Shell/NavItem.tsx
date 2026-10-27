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
  '/profil': 'Profil Akun',
};

interface NavItemProps {
  path: string;
  pending: number;
  collapsed?: boolean;
}

export default function NavItem({ path, pending, collapsed = false }: NavItemProps) {
  const Icon = ICONS[path] ?? LayoutDashboard;
  const match = useMatch({ path, end: true });
  const isActive = !!match;

  if (collapsed) {
    return (
      <Link
        to={path}
        title={LABELS[path]}
        aria-label={LABELS[path]}
        className={`group relative flex h-10 w-10 items-center justify-center rounded-xl mx-auto my-0.5 no-underline transition-all duration-200 select-none ${
          isActive
            ? 'bg-[#E0FBFC] text-[#0077B6] font-semibold shadow-2xs'
            : 'text-slate-500 hover:bg-slate-100/80 hover:text-[#0077B6]'
        }`}
      >
        <Icon
          size={19}
          strokeWidth={isActive ? 2.4 : 1.9}
          aria-hidden="true"
          className={`shrink-0 transition-colors ${
            isActive ? 'text-[#0077B6]' : 'text-slate-400 group-hover:text-[#0077B6]'
          }`}
        />
        {path === '/pendaftaran' && pending > 0 ? (
          <span
            title={`${pending} antrean pendaftaran`}
            className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#FF6F59] ring-2 ring-white"
          />
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      to={path}
      className={`group relative flex min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all duration-200 select-none ${
        isActive
          ? 'bg-[#E0FBFC] text-[#0077B6] font-semibold shadow-2xs'
          : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#0077B6]'
      }`}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#0077B6]"
        />
      )}
      <Icon
        size={18}
        strokeWidth={isActive ? 2.2 : 1.8}
        aria-hidden="true"
        className={`shrink-0 transition-colors ${
          isActive ? 'text-[#0077B6]' : 'text-slate-400 group-hover:text-[#0077B6]'
        }`}
      />
      <span className="flex-1 truncate">{LABELS[path]}</span>
      {path === '/pendaftaran' && pending > 0 ? (
        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-[#FF6F59] px-2 py-0.5 text-[11px] font-bold text-white tabular-nums shadow-xs">
          {pending}
        </span>
      ) : null}
    </Link>
  );
}
