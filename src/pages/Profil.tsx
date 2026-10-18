import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card, RoleTag } from '../components/ui';
import { initials } from '../lib/format';
import { apiGetProfil, apiUploadAvatar } from '../lib/api';
import type { ServerProfil } from '../lib/api-types';
import { useAuth } from '../lib/auth-context';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export default function Profil() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [localAvatar, setLocalAvatar] = useState<string>('');

  const { data: profil, isLoading } = useQuery<ServerProfil>({
    queryKey: ['profil'],
    queryFn: () => apiGetProfil(),
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: (form: FormData) => apiUploadAvatar(form),
    onSuccess: (res) => {
      const url = (res as { profilePictureUrl?: string }).profilePictureUrl;
      if (url) {
        try { localStorage.setItem('tl_avatar', url); } catch { /* ignore */ }
        setLocalAvatar(url);
        queryClient.invalidateQueries({ queryKey: ['profil'] });
        toast.success('Avatar diperbarui.');
      }
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal mengunggah avatar.', { style: { color: '#B3341F' } }),
  });

  const avatarUrl = profil?.avatarUrl || localAvatar || '';

  function onAvatar(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast.error('Avatar harus berupa gambar (JPG, PNG, WEBP).', { style: { color: '#B3341F' } });
      e.target.value = '';
      return;
    }
    if (f.size > MAX_AVATAR_BYTES) {
      toast.error('Ukuran file terlalu besar. Maksimal 5 MB.', { style: { color: '#B3341F' } });
      e.target.value = '';
      return;
    }
    const form = new FormData();
    form.append('profilePicture', f);
    uploadMutation.mutate(form);
    e.target.value = '';
  }

  function removeAvatar() {
    try { localStorage.removeItem('tl_avatar'); } catch { /* ignore */ }
    setLocalAvatar('');
    toast.success('Avatar dihapus.');
  }

  const displayName = profil?.nama ?? user!.nama;
  const displayEmail = profil?.email ?? user!.email ?? user!.username;
  const displayLokasi = profil?.lokasi ?? user!.lokasi ?? 'Semua lokasi';

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat profil…</div>
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
            <span className="grid h-24 w-24 place-items-center rounded-full bg-azure font-display text-2xl font-bold text-primary">
              {initials(displayName)}
            </span>
          )}
          <div>
            <p className="font-semibold">{displayName}</p>
            <div className="mt-1.5">
              <RoleTag>{user!.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
            </div>
          </div>
          <label className="cursor-pointer rounded-lg border border-gray-200 px-3.5 py-2 font-semibold text-primary transition-colors hover:bg-azure">
            Ganti avatar
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onAvatar} className="hidden" />
          </label>
          {avatarUrl ? (
            <Button variant="ghost" className="px-3 py-1 text-[13px]" onClick={removeAvatar}>
              Hapus avatar
            </Button>
          ) : null}
          <p className="text-[13px] text-slate-500">Maksimal 5 MB (JPG, PNG, WEBP).</p>
        </Card>

        <Card>
          <h3 className="mb-2.5 text-base">Detail akun</h3>
          <dl>
            <div className="flex border-b border-gray-200 py-2.5 last:border-0">
              <dt className="w-44 shrink-0 text-slate-500">Nama</dt>
              <dd className="font-semibold">{displayName}</dd>
            </div>
            <div className="flex border-b border-gray-200 py-2.5 last:border-0">
              <dt className="w-44 shrink-0 text-slate-500">Username / email</dt>
              <dd className="font-semibold">{displayEmail}</dd>
            </div>
            <div className="flex border-b border-gray-200 py-2.5 last:border-0">
              <dt className="w-44 shrink-0 text-slate-500">Peran</dt>
              <dd className="font-semibold">{user!.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</dd>
            </div>
            <div className="flex border-b border-gray-200 py-2.5 last:border-0">
              <dt className="w-44 shrink-0 text-slate-500">Lokasi</dt>
              <dd className="font-semibold">{displayLokasi}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
