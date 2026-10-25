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
  const displayLokasi = profil?.lokasi ?? user!.lokasi ?? 'Semua lokasi';
  const avatarUrl = assetUrl(profil?.avatarUrl);

  if (isLoading) {
    return <ProfilLoading />;
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Profil</h2>
        <p className="text-slate-500">Informasi akun yang sedang masuk</p>
      </div>

      <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[960px]:[grid-template-columns:280px_1fr]">
        <ProfilCard
          displayName={displayName}
          avatarUrl={avatarUrl}
          role={user!.role}
        />
        <ProfilDetailCard
          displayName={displayName}
          displayEmail={displayEmail}
          displayLokasi={displayLokasi}
          role={user!.role}
        />
      </div>
    </div>
  );
}
