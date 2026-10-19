import { SkeletonHeader, SkeletonPage, SkeletonProfile } from '../components/Skeleton';
import { Card, RoleTag } from '../components/ui';
import { assetUrl } from '../lib/api';
import { initials } from '../lib/format';
import { API_KEYS, fetchProfile } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';
import { useAuth } from '../lib/auth-context';

export default function Profil() {
  const { user } = useAuth();
  const { data: profil, loading: isLoading } = useResource(API_KEYS.profile, fetchProfile);

  const displayName = profil?.nama ?? user!.nama;
  const displayEmail = profil?.email ?? user!.email ?? user!.username;
  const displayLokasi = profil?.lokasi ?? user!.lokasi ?? 'Semua lokasi';
  const avatarUrl = assetUrl(profil?.avatarUrl);

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat profil akun">
        <SkeletonHeader />
        <SkeletonProfile />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Profil</h2>
        <p className="text-slate-500">Informasi akun yang sedang masuk</p>
      </div>

      <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[960px]:[grid-template-columns:280px_1fr]">
        <Card className="flex flex-col items-center gap-3 py-6 text-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`Avatar ${displayName}`} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <span aria-hidden="true" className="grid h-24 w-24 place-items-center rounded-full bg-azure font-display text-2xl font-bold text-primary">
              {initials(displayName)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{displayName}</p>
            <div className="mt-1.5">
              <RoleTag>{user!.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2.5 text-base">Detail akun</h3>
          <dl>
            <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
              <dt className="text-slate-500 sm:w-44 sm:shrink-0">Nama</dt>
              <dd className="m-0 break-words font-semibold">{displayName}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
              <dt className="text-slate-500 sm:w-44 sm:shrink-0">Username / email</dt>
              <dd className="m-0 break-all font-semibold">{displayEmail}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
              <dt className="text-slate-500 sm:w-44 sm:shrink-0">Peran</dt>
              <dd className="m-0 font-semibold">{user!.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
              <dt className="text-slate-500 sm:w-44 sm:shrink-0">Lokasi</dt>
              <dd className="m-0 font-semibold">{displayLokasi}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
