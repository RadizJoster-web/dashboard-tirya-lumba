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
}

export default function Sidebar({
  sidebarOpen,
  isDesktop,
  user,
  allowedSet,
  pending,
  onToggleSidebar,
}: SidebarProps) {
  return (
    <aside
      inert={!sidebarOpen && isDesktop}
      className={`flex gap-1 border-gray-200 bg-white px-3 py-5 transition-transform duration-300 ease-in-out max-[860px]:static max-[860px]:h-auto max-[860px]:flex-row max-[860px]:overflow-x-auto max-[860px]:border-b max-[860px]:p-2.5 min-[861px]:fixed min-[861px]:inset-y-0 min-[861px]:left-0 min-[861px]:z-20 min-[861px]:h-dvh min-[861px]:w-[248px] min-[861px]:flex-col min-[861px]:border-r ${
        sidebarOpen ? 'min-[861px]:translate-x-0' : 'min-[861px]:-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-2.5 px-2 pb-4 text-[17px] font-bold text-primary max-[860px]:px-2 max-[860px]:pb-0">
        <BrandLogo sz={32} />
        <span className="font-display">Tirya Lumba</span>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Sembunyikan sidebar"
          title="Sembunyikan sidebar"
          className="ml-auto hidden min-h-[44px] min-w-[44px] place-items-center rounded-lg text-slate-500 transition-colors hover:bg-azure hover:text-primary min-[861px]:grid"
        >
          <PanelLeftClose size={20} aria-hidden="true" className="shrink-0" />
        </button>
      </div>

      {GROUPS.map((g) => {
        const groupPaths = g.paths.filter((p) => allowedSet.has(p));
        if (groupPaths.length === 0) return null;
        return (
          <div key={g.title} className="flex gap-1 max-[860px]:contents min-[861px]:flex-col">
            <p className="px-3 pt-3 text-[11px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase max-[860px]:hidden">
              {g.title}
            </p>
            {groupPaths.map((p) => (
              <NavItem key={p} path={p} pending={pending} />
            ))}
          </div>
        );
      })}

      <SidebarUserCard user={user} />
    </aside>
  );
}
