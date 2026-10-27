import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
  user,
  allowedSet,
  pending,
  onToggleSidebar,
  onLogout,
}: SidebarProps) {
  const isCollapsed = !sidebarOpen;

  return (
    <aside
      className={`hidden min-[861px]:flex fixed inset-y-0 left-0 z-30 h-dvh flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out shadow-xs ${
        isCollapsed ? 'w-[68px] px-2 py-4' : 'w-64 px-3.5 py-5'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`flex items-center border-b border-gray-100 pb-4 ${
          isCollapsed ? 'flex-col gap-3 px-1' : 'gap-2.5 px-2'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BrandLogo sz={isCollapsed ? 30 : 32} />
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-display block text-base font-bold text-[#1D3557] tracking-tight truncate">
                Tirya Lumba
              </span>
              <span className="block text-[11px] font-medium text-slate-400 truncate">
                SaaS Management
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isCollapsed ? 'Perluas sidebar' : 'Kecilkan sidebar'}
          title={isCollapsed ? 'Perluas sidebar' : 'Kecilkan sidebar'}
          className={`h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 grid cursor-pointer ${
            isCollapsed ? 'mt-1' : 'ml-auto'
          }`}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} aria-hidden="true" className="shrink-0" />
          ) : (
            <PanelLeftClose size={18} aria-hidden="true" className="shrink-0" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto space-y-3 pt-3 no-scrollbar">
        {GROUPS.map((g) => {
          const groupPaths = g.paths.filter((p) => allowedSet.has(p));
          if (groupPaths.length === 0) return null;
          return (
            <div key={g.title} className="flex flex-col gap-0.5">
              {!isCollapsed && (
                <p className="px-3 pt-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 select-none">
                  {g.title}
                </p>
              )}
              {groupPaths.map((p) => (
                <NavItem
                  key={p}
                  path={p}
                  pending={pending}
                  collapsed={isCollapsed}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom User Card */}
      <SidebarUserCard
        user={user}
        collapsed={isCollapsed}
        onLogout={onLogout}
      />
    </aside>
  );
}
