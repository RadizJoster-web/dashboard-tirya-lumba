import { Suspense, lazy, useEffect, useState } from 'react';
import {
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  PanelLeftClose,
  ShieldCheck,
  Trophy,
  UserCircle,
  UserPlus,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BrandLogo from './BrandLogo';
import Topbar from './Topbar';
const Absensi = lazy(() => import('../pages/Absensi'));
const Jadwal = lazy(() => import('../pages/Jadwal'));
const Lokasi = lazy(() => import('../pages/Lokasi'));
const Overview = lazy(() => import('../pages/Overview'));
const Pendaftaran = lazy(() => import('../pages/Pendaftaran'));
const Paket = lazy(() => import('../pages/Paket'));
const Pelatih = lazy(() => import('../pages/Pelatih'));
const Pengelola = lazy(() => import('../pages/Pengelola'));
const Siswa = lazy(() => import('../pages/Siswa'));
const Profil = lazy(() => import('../pages/Profil'));
import { NAV, logout, pathsFor } from '../lib/auth';
import type { SessionUser } from '../lib/auth';
import { initials } from '../lib/format';
import { useAntrean } from '../lib/store';
import { useUiStore } from '../lib/ui-store';
import { useApiSync } from '../lib/api-sync';

interface ShellProps {
  user: SessionUser;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const ICONS: Record<string, LucideIcon> = {
  '/': LayoutDashboard,
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

function PageFallback() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat halaman…</div>
  );
}

const GROUPS: Array<{ title: string; paths: string[] }> = [
  { title: 'Operasional', paths: ['/', '/pendaftaran', '/absen', '/siswa'] },
  { title: 'Master Data', paths: ['/jadwal', '/lokasi', '/paket', '/pelatih', '/pengelola'] },
  { title: 'Akun', paths: ['/profil'] },
];

export default function Shell({ user, activePath, onNavigate, onLogout }: ShellProps) {
  useApiSync();
  const nav = pathsFor(user.role);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const antrean = useAntrean();
  const pending = user.role === 'admin' ? antrean.length : antrean.filter((a) => a.lokasi === user.lokasi).length;
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 861px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div className="min-h-screen">
      {!sidebarOpen ? (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Tampilkan sidebar"
          title="Tampilkan sidebar"
          className="fixed top-4 left-4 z-30 hidden h-11 w-11 place-items-center rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 focus-visible:outline-2 outline-offset-2 outline-aqua min-[861px]:grid"
        >
          <BrandLogo sz={30} className="drop-shadow-[0_2px_6px_rgba(16,60,92,0.18)]" />
        </button>
      ) : null}
      <aside
        inert={!sidebarOpen && isDesktop}
        className={`flex gap-1 border-gray-200 bg-white px-3 py-5 transition-transform duration-300 ease-in-out max-[860px]:static max-[860px]:h-auto max-[860px]:flex-row max-[860px]:overflow-x-auto max-[860px]:border-b max-[860px]:p-2.5 min-[861px]:fixed min-[861px]:inset-y-0 min-[861px]:left-0 min-[861px]:z-20 min-[861px]:h-dvh min-[861px]:w-[248px] min-[861px]:flex-col min-[861px]:border-r ${sidebarOpen ? 'min-[861px]:translate-x-0' : 'min-[861px]:-translate-x-full'}`}
      >
        <div className="flex items-center gap-2.5 px-2 pb-4 text-[17px] font-bold text-primary max-[860px]:px-2 max-[860px]:pb-0">
          <BrandLogo sz={32} />
          <span className="font-display">Tirya Lumba</span>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Sembunyikan sidebar"
            title="Sembunyikan sidebar"
            className="ml-auto hidden min-h-[44px] min-w-[44px] place-items-center rounded-lg text-slate-500 transition-colors hover:bg-azure hover:text-primary min-[861px]:grid"
          >
            <PanelLeftClose size={20} aria-hidden="true" className="shrink-0" />
          </button>
        </div>

        {GROUPS.map((g) => {
          const items = g.paths
            .map((p) => nav.find((n) => n.path === p))
            .filter((n) => n !== undefined);
          if (items.length === 0) return null;
          return (
            <div key={g.title} className="flex gap-1 max-[860px]:contents min-[861px]:flex-col">
              <p className="px-3 pt-3 text-[11px] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase max-[860px]:hidden">
                {g.title}
              </p>
              {items.map((n) => {
                const Icon = ICONS[n.path] ?? LayoutDashboard;
                const isActive = activePath === n.path;
                return (
                  <a
                    key={n.path}
                    href={`#${n.path}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={n.label}
                    title={n.label}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(n.path);
                    }}
                    className={`relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 no-underline transition-colors duration-300 ease-in-out max-[860px]:whitespace-nowrap ${
                      isActive ? 'bg-azure font-semibold text-primary' : 'text-slate-500 hover:bg-azure hover:text-primary'
                    }`}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-full bg-primary max-[860px]:hidden"
                      />
                    ) : null}
                    <Icon size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
                    <span className="flex-1 whitespace-nowrap">{n.label}</span>
                    {n.path === '/pendaftaran' && pending > 0 ? (
                      <span className="ml-auto rounded-full bg-[#B3341F] px-2 py-0.5 text-[11px] font-bold text-white">{pending}</span>
                    ) : null}
                  </a>
                );
              })}
            </div>
          );
        })}

        <div className="mt-auto hidden flex-col gap-2 pt-4 min-[861px]:flex">
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-2.5 py-2">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-azure font-display text-sm font-bold text-primary">
              {initials(user.nama)}
            </span>
            <span className="min-w-0 flex-1 whitespace-nowrap">
              <span className="block truncate text-sm font-semibold">{user.nama}</span>
              <span className="block text-xs text-slate-500">{user.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</span>
            </span>
          </div>
        </div>
      </aside>

      <div className={`min-w-0 transition-[padding] duration-300 ease-in-out ${sidebarOpen ? 'min-[861px]:pl-[248px]' : ''}`}>
        <Topbar user={user} onNavigate={onNavigate} onLogout={handleLogout} />
        <main className="p-6 px-7 max-[860px]:p-4 min-w-0">
          <div key={activePath} className="anim-route min-w-0">
            <Suspense fallback={<PageFallback />}>
          {activePath === '/' ? (
            <Overview user={user} />
          ) : activePath === '/siswa' ? (
            <Siswa user={user} />
          ) : activePath === '/pendaftaran' ? (
            <Pendaftaran user={user} />
          ) : activePath === '/jadwal' ? (
            <Jadwal />
          ) : activePath === '/lokasi' ? (
            <Lokasi />
          ) : activePath === '/paket' ? (
            <Paket />
          ) : activePath === '/pelatih' ? (
            <Pelatih />
          ) : activePath === '/pengelola' ? (
            <Pengelola />
          ) : activePath === '/absen' ? (
            <Absensi user={user} />
          ) : activePath === '/profil' ? (
            <Profil user={user} />
          ) : (
            <div>
              <div className="mb-5">
                <h2 className="text-2xl leading-8 font-bold">{NAV.find((n) => n.path === activePath)?.label ?? 'Halaman'}</h2>
                <p className="text-slate-500">Halaman tidak ditemukan.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-7 text-center text-slate-500">
                Pilih menu di samping untuk berpindah halaman.
              </div>
            </div>
          )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
