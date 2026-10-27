import { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Topbar from '../Topbar';
import { RouteLoading } from '../../loading';
import { useAuth } from '../../../lib/auth-context';
import { logout, pathsFor } from '../../../lib/auth';
import { useUiStore } from '../../../lib/ui-store';
import { useAntrean } from '../../../lib/local/registration-queue';
import Sidebar from './Sidebar';
import SidebarToggleButton from './SidebarToggleButton';

export default function Shell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const antrean = useAntrean();
  const allowedPaths = pathsFor(user!.role);
  const allowedSet = new Set(allowedPaths.map((n) => n.path));
  const pending = user!.role === 'admin' ? antrean.length : antrean.filter((a) => a.lokasi === user!.lokasi).length;
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 861px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {!sidebarOpen ? <SidebarToggleButton onToggle={toggleSidebar} /> : null}
      <Sidebar
        sidebarOpen={sidebarOpen}
        isDesktop={isDesktop}
        user={user}
        allowedSet={allowedSet}
        pending={pending}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      <div className={`min-w-0 transition-[padding] duration-300 ease-in-out ${sidebarOpen ? 'min-[861px]:pl-64' : ''}`}>
        <Topbar user={user!} onLogout={handleLogout} />
        <main className="min-w-0 overflow-x-clip p-6 lg:p-8 max-[860px]:p-4">
          <Suspense fallback={<RouteLoading />}>
            <div className="anim-route min-w-0">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
