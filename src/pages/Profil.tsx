import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { Button, Card, RoleTag } from '../components/ui';
import { initials } from '../lib/format';
import type { SessionUser } from '../lib/auth';

const AVATAR_KEY = 'tl_avatar';
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

function loadAvatar(): string {
  try {
    return localStorage.getItem(AVATAR_KEY) ?? '';
  } catch {
    return '';
  }
}

export default function Profil({ user }: { user: SessionUser }) {
  const [avatar, setAvatar] = useState<string>(() => loadAvatar());

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
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      try {
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } catch {
        toast.error('Perangkat ini menolak menyimpan avatar.', { style: { color: '#B3341F' } });
        return;
      }
      setAvatar(dataUrl);
      toast.success('Avatar tersimpan di perangkat ini.');
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  }

  function removeAvatar() {
    try {
      localStorage.removeItem(AVATAR_KEY);
    } catch {
      // ignore
    }
    setAvatar('');
    toast.success('Avatar dihapus.');
  }

  const rows: Array<[string, string]> = [
    ['Nama', user.nama],
    ['Username / email', user.email ?? user.username],
    ['Peran', user.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'],
    ['Lokasi', user.lokasi ?? 'Semua lokasi'],
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Profil</h2>
        <p className="text-slate-500">Informasi akun yang sedang masuk</p>
      </div>

      <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[960px]:[grid-template-columns:280px_1fr]">
        <Card className="flex flex-col items-center gap-3 py-6 text-center">
          {avatar ? (
            <img src={avatar} alt={`Avatar ${user.nama}`} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-full bg-azure font-display text-2xl font-bold text-primary">
              {initials(user.nama)}
            </span>
          )}
          <div>
            <p className="font-semibold">{user.nama}</p>
            <div className="mt-1.5">
              <RoleTag>{user.role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
            </div>
          </div>
          <label className="cursor-pointer rounded-lg border border-gray-200 px-3.5 py-2 font-semibold text-primary transition-colors hover:bg-azure">
            Ganti avatar
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onAvatar} className="hidden" />
          </label>
          {avatar ? (
            <Button variant="ghost" className="px-3 py-1 text-[13px]" onClick={removeAvatar}>
              Hapus avatar
            </Button>
          ) : null}
          <p className="text-[13px] text-slate-500">
            Disimpan lokal di browser ini. Endpoint profil/avatar admin belum tersedia di server.
          </p>
        </Card>

        <Card>
          <h3 className="mb-2.5 text-base">Detail akun</h3>
          <dl>
            {rows.map(([k, val]) => (
              <div key={k} className="flex border-b border-gray-200 py-2.5 last:border-0">
                <dt className="w-44 shrink-0 text-slate-500">{k}</dt>
                <dd className="font-semibold">{val}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
