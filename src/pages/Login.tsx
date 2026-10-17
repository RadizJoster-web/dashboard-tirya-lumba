import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field } from '../components/ui';
import { authenticate } from '../lib/auth';
import type { SessionUser } from '../lib/auth';

export default function Login({ onSuccess }: { onSuccess: (u: SessionUser) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [userError, setUserError] = useState('');
  const [passError, setPassError] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function fillDemo(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setUserError('');
    setPassError('');
    setFormError('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const u = username.trim();
    setUserError(u ? '' : 'Username atau email wajib diisi.');
    setPassError(password.length >= 6 ? '' : 'Password minimal 6 karakter.');
    setFormError('');
    if (!u || password.length < 6) return;
    setBusy(true);
    const result = await authenticate(u, password, remember);
    setBusy(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    onSuccess(result.user);
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-basedash">
      <form onSubmit={submit} noValidate className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-[400px]">
        <img src="/logo-mark.svg" alt="Logo PT Tirya Lumba" width={40} height={40} draggable={false} className="mx-auto w-10 h-10 object-contain" />
        <h1 className="text-[26px] leading-[34px] mt-3.5 mb-1">Masuk ke Dashboard</h1>
        <p className="text-slate-500 mb-5">Kelola kolam, jadwal, dan siswa dalam satu tempat.</p>

        <Field
          id="username"
          label="Username atau email"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={userError}
        />
        <Field
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passError}
        />

        <label className="block font-medium mb-2.5">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-auto mr-1.5 align-middle accent-primary"
          />
          Ingat aku
        </label>
        {formError ? <span className="block text-[#B3341F] text-[13px] font-medium mb-2.5">{formError}</span> : null}

        <Button type="submit" className="w-full py-2.5" disabled={busy}>
          {busy ? 'Memproses…' : 'Masuk'}
        </Button>

        <div className="mt-4 p-3 rounded-lg bg-azure text-[13px]">
          Akun demo:
          <br />
          <button type="button" onClick={() => fillDemo('admin', 'admin123')} className="bg-transparent border-0 text-primary font-semibold cursor-pointer p-0 underline">
            Admin Pusat
          </button>
          {' · '}
          <button type="button" onClick={() => fillDemo('pengelola', 'kolam123')} className="bg-transparent border-0 text-primary font-semibold cursor-pointer p-0 underline">
            Pengelola Kolam
          </button>
          <p className="mt-2 mb-0 text-slate-500">Masuk dengan email akun server untuk memakai data asli.</p>
        </div>
      </form>
    </div>
  );
}
