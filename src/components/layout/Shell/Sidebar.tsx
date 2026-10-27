import { PanelLeftClose } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import NavItem from './NavItem';
import SidebarUserCard from './SidebarUserCard';
import type { SessionUser } from '../../../lib/auth';

const GROUPS: Array<{ title: string; paths: string[] }> = [
  { title: 'Operasional', paths: ['/overview', '/pendaftaran', '/siswa', '/pelatih', '/absen'] },
  { title: 'Master Data', paths: ['/jadwal', '/lokasi', '/paket', '/pengelola'] },
  { title: 'Akun', paths: ['/profil'] },
];

interface SidebarProps {
  sidebarOpen: boolean;
  isDesktop: boolean;
  user: SessionUser | null;
  allowedSet: Set<string>;
  pending: number;
  onToggleSidebar: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  sidebarOpen,
  isDesktop,
  user,
  allowedSet,
  pending,
  onToggleSidebar,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      inert={!sidebarOpen && isDesktop}
      className={`flex gap-1 border-gray-200 bg-white px-3.5 py-5 transition-transform duration-300 ease-in-out max-[860px]:static max-[860px]:h-auto max-[860px]:flex-row max-[860px]:overflow-x-auto max-[860px]:border-b max-[860px]:p-2.5 min-[861px]:fixed min-[861px]:inset-y-0 min-[861px]:left-0 min-[861px]:z-30 min-[861px]:h-dvh min-[861px]:w-64 min-[861px]:flex-col min-[861px]:border-r shadow-xs ${
        sidebarOpen ? 'min-[861px]:translate-x-0' : 'min-[861px]:-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-2 pb-5 border-b border-gray-100 max-[860px]:border-b-0 max-[860px]:px-2 max-[860px]:pb-0">
        <BrandLogo sz={32} />
        <div>
          <span className="font-display block text-base font-bold text-[#1D3557] tracking-tight">
            Tirya Lumba
          </span>
          <span className="hidden min-[861px]:block text-[11px] font-medium text-slate-400">
            SaaS Management
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Sembunyikan sidebar"
          title="Sembunyikan sidebar"
          className="ml-auto hidden h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 min-[861px]:grid cursor-pointer"
        >
          <PanelLeftClose size={18} aria-hidden="true" className="shrink-0" />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto space-y-4 pt-2">
        {GROUPS.map((g) => {
          const groupPaths = g.paths.filter((p) => allowedSet.has(p));
          if (groupPaths.length === 0) return null;
          return (
            <div key={g.title} className="flex gap-1 max-[860px]:contents min-[861px]:flex-col">
              <p className="px-3 pt-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 max-[860px]:hidden select-none">
                {g.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {groupPaths.map((p) => (
                  <NavItem key={p} path={p} pending={pending} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom User Card */}
      <SidebarUserCard user={user} onLogout={onLogout} />
    </aside>
  );
}
