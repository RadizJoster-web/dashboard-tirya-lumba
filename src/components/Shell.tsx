import { Button, RoleTag } from './ui';
import { logout, pathsFor } from '../lib/auth';
import type { SessionUser } from '../lib/auth';

interface ShellProps {
  user: SessionUser;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function Shell({ user, activePath, onNavigate, onLogout }: ShellProps) {
  const nav = pathsFor(user.role);

  function handleLogout() {
    logout();
    onLogout();
  }

  return (
    <div className="grid min-h-screen min-[861px]:grid-cols-[232px_1fr] grid-cols-1">
      <aside className="bg-white border-r border-gray-200 px-3 py-5 flex gap-1 min-[861px]:sticky min-[861px]:top-0 min-[861px]:h-screen min-[861px]:flex-col max-[860px]:flex-row max-[860px]:overflow-x-auto max-[860px]:p-2.5 max-[860px]:static max-[860px]:h-auto">
        <div className="flex gap-2.5 items-center px-2 pb-4.5 text-[17px] font-bold text-primary max-[860px]:pb-0 max-[860px]:px-2">
          <span className="w-8 h-8 rounded-lg bg-primary grid place-items-center text-white not-italic">
            🐬
          </span>
          <span className="font-display">Tirya Lumba</span>
        </div>
        {nav.map((n) => (
          <a
            key={n.path}
            href={`#${n.path}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(n.path);
            }}
            className={`px-3 py-2 rounded-lg no-underline transition-all duration-300 ease-in-out max-[860px]:whitespace-nowrap ${
              activePath === n.path
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-azure hover:text-primary'
            }`}
          >
            {n.label}
          </a>
        ))}
      </aside>

      <div className="min-w-0">
        <div className="flex justify-end items-center gap-2.5 pt-3 px-7 max-[860px]:px-4">
          <RoleTag>{user.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
          <span>{user.nama}</span>
          <Button variant="ghost" onClick={handleLogout} className="text-[13px] px-2.5 py-1">
            Keluar
          </Button>
        </div>
        <main className="p-6 px-7 max-[860px]:p-4 min-w-0">
          <div className="mb-5">
            <h2 className="text-2xl leading-8 font-bold">Overview</h2>
            <p className="text-slate-500">
              {user.role === 'admin' ? 'Statistik seluruh cabang' : `Statistik ${user.lokasi ?? ''}`}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-7 text-center text-slate-500">
            Halaman konten menyusul setelah konfirmasi.
          </div>
        </main>
      </div>
    </div>
  );
}
