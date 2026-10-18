import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button, RoleTag } from './ui';
import Modal from './Modal';
import { initials } from '../lib/format';
import { useApiMode } from '../lib/api-mode';
import { useAntrean, useResched } from '../lib/store';
import type { SessionUser } from '../lib/auth';

interface TopbarProps {
  user: SessionUser;
  onLogout: () => void;
}

export default function Topbar({ user, onLogout }: TopbarProps) {
  const admin = user.role === 'admin';
  const navigate = useNavigate();
  const apiMode = useApiMode((s) => s.mode);
  const antrean = useAntrean();
  const resched = useResched();
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const logoutRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const pendingDaftar = admin ? antrean.length : antrean.filter((a) => a.lokasi === user.lokasi).length;
  const pendingJadwal = admin ? resched.length : 0;
  const total = pendingDaftar + pendingJadwal;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        bellRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function go(path: string) {
    setOpen(false);
    navigate(path);
  }

  function cancelLogout() {
    setConfirmLogout(false);
    logoutRef.current?.focus();
  }

  useEffect(() => {
    if (confirmLogout) cancelRef.current?.focus();
  }, [confirmLogout]);

  const items =
    total === 0
      ? []
      : [
          ...(pendingDaftar > 0
            ? [{ key: 'daftar', label: `${pendingDaftar} pendaftaran menunggu persetujuan`, count: pendingDaftar, path: '/pendaftaran' }]
            : []),
          ...(pendingJadwal > 0
            ? [{ key: 'jadwal', label: `${pendingJadwal} request reschedule menunggu`, count: pendingJadwal, path: '/jadwal' }]
            : []),
        ];

  return (
    <>
    <header className="sticky top-0 z-10 flex items-center justify-end gap-2.5 border-b border-gray-200 bg-white/95 px-7 py-2 backdrop-blur max-[860px]:px-4">
      <div className="relative">
        <button
          ref={bellRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={total > 0 ? `${total} notifikasi baru` : 'Notifikasi'}
          title="Notifikasi"
          className="relative grid min-h-[44px] min-w-[44px] place-items-center rounded-xl text-slate-500 transition-colors hover:bg-azure hover:text-primary"
        >
          <Bell size={20} aria-hidden="true" />
          {total > 0 ? (
            <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#B3341F] px-1 text-[11px] font-bold text-white">
              {total}
            </span>
          ) : null}
        </button>
        {open ? (
          <>
            <button type="button" aria-label="Tutup notifikasi" onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default bg-transparent" />
            <div role="menu" aria-label="Notifikasi" className="absolute right-0 z-20 mt-2 w-[300px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              {items.length === 0 ? (
                <p className="px-3 py-5 text-center text-sm text-slate-500">Tidak ada notifikasi baru.</p>
              ) : (
                items.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    role="menuitem"
                    onClick={() => go(it.path)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-azure"
                  >
                    <span className="flex-1">{it.label}</span>
                    <span className="rounded-full bg-[#B3341F] px-2 py-0.5 text-[11px] font-bold text-white">{it.count}</span>
                  </button>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
      <span
        title={
          apiMode === 'live'
            ? 'Terhubung ke server'
            : apiMode === 'checking'
              ? 'Menghubungkan ke server'
              : 'Server tidak terjangkau, memakai data demo'
        }
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          apiMode === 'live' ? 'bg-azure text-primary' : 'bg-[#fdf1d6] text-[#8a5a00]'
        }`}
      >
        {apiMode === 'live' ? 'Server aktif' : apiMode === 'checking' ? 'Menghubungkan…' : 'Mode demo'}
      </span>
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-azure font-display text-sm font-bold text-primary">
        {initials(user.nama)}
      </span>
      <RoleTag>{admin ? 'Admin Pusat' : 'Pengelola Kolam'}</RoleTag>
      <span>{user.nama}</span>
      <button
        ref={logoutRef}
        type="button"
        onClick={() => setConfirmLogout(true)}
        className="min-h-[44px] rounded-lg border border-gray-200 bg-transparent px-2.5 py-1 text-[13px] font-semibold text-ink inline-flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:border-[#B3341F] hover:bg-[#B3341F] hover:text-white focus-visible:border-[#B3341F] focus-visible:bg-[#B3341F] focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3341F]"
      >
        Log out
      </button>
    </header>
    {confirmLogout ? (
      <Modal
        title="Keluar dari akun?"
        onClose={cancelLogout}
        footer={
          <>
            <button
              ref={cancelRef}
              type="button"
              onClick={cancelLogout}
              className="min-h-[44px] rounded-lg border border-gray-200 bg-transparent px-3.5 py-2 font-semibold text-ink inline-flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-azure"
            >
              Batal
            </button>
            <Button variant="danger" onClick={onLogout}>
              Keluar
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">Kamu yakin ingin keluar dari sesi ini?</p>
      </Modal>
    ) : null}
    </>
  );
}
