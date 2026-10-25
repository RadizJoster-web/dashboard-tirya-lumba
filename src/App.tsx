import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Shell from './components/layout/Shell';
import { RouteLoading } from './components/loading';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './lib/auth-context';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const Overview = lazy(() => import('./pages/Overview'));
const Pendaftaran = lazy(() => import('./pages/Pendaftaran'));
const PendaftaranDetail = lazy(() => import('./pages/Pendaftaran/Detail'));
const Jadwal = lazy(() => import('./pages/Jadwal'));
const Lokasi = lazy(() => import('./pages/Lokasi'));
const Paket = lazy(() => import('./pages/Paket'));
const Pelatih = lazy(() => import('./pages/Pelatih'));
const PelatihDetail = lazy(() => import('./pages/Pelatih/Detail'));
const Pengelola = lazy(() => import('./pages/Pengelola'));
const Absensi = lazy(() => import('./pages/Absensi'));
const Siswa = lazy(() => import('./pages/Siswa'));
const SiswaDetail = lazy(() => import('./pages/Siswa/Detail'));
const Profil = lazy(() => import('./pages/Profil'));

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1d3557',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(29, 53, 87, 0.12)',
          },
        }}
      />
      <HashRouter>
        <Suspense
          fallback={
            <div className="p-6">
              <RouteLoading />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Shell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/overview" replace />} />
              <Route path="overview" element={<Overview />} />
              <Route path="pendaftaran" element={<Pendaftaran />} />
              <Route path="pendaftaran/:id" element={<PendaftaranDetail />} />
              <Route path="jadwal" element={<Jadwal />} />
              <Route path="lokasi" element={<Lokasi />} />
              <Route path="paket" element={<Paket />} />
              <Route path="pelatih" element={<Pelatih />} />
              <Route path="pelatih/:id" element={<PelatihDetail />} />
              <Route path="pengelola" element={<Pengelola />} />
              <Route path="absen" element={<Absensi />} />
              <Route path="siswa" element={<Siswa />} />
              <Route path="siswa/:id" element={<SiswaDetail />} />
              <Route path="profil" element={<Profil />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  );
}
