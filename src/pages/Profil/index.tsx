import { ProfilLoading } from '../../components/loading';
import { apiGet, assetUrl } from '../../lib/api/client';
import { useResource } from '../../lib/api/cache';
import type { ServerProfil } from '../../lib/api/types';
import { useAuth } from '../../lib/auth-context';
import ProfilCard from './ProfilCard';
import ProfilDetailCard from './ProfilDetailCard';

const fetchProfile = (): Promise<ServerProfil> =>
  apiGet<ServerProfil>('/auth/me');

export default function Profil() {
  const { user } = useAuth();
  const { data: profil, loading: isLoading } = useResource(
    '/auth/me',
    fetchProfile,
  );

  const displayName = profil?.nama ?? user!.nama;
  const displayEmail = profil?.email ?? user!.email ?? user!.username;
  const displayLokasi = profil?.lokasi ?? user!.lokasi ?? 'Semua cabang kolam';
  const avatarUrl = assetUrl(profil?.avatarUrl);

  if (isLoading) {
    return <ProfilLoading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
          Profil Pengguna
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-normal">
          Informasi identitas akun dan hak akses operasional yang sedang aktif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1">
          <ProfilCard
            displayName={displayName}
            avatarUrl={avatarUrl}
            role={user!.role}
          />
        </div>
        <div className="md:col-span-2">
          <ProfilDetailCard
            displayName={displayName}
            displayEmail={displayEmail}
            displayLokasi={displayLokasi}
            role={user!.role}
          />
        </div>
      </div>
    </div>
  );
}
