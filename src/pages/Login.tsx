import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field } from '../components/ui';
import { login } from '../lib/auth';
import type { SessionUser } from '../lib/auth';

export default function Login({ onSuccess }: { onSuccess: (u: SessionUser) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [userError, setUserError] = useState('');
  const [passError, setPassError] = useState('');
  const [formError, setFormError] = useState('');

  function fillDemo(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setUserError('');
    setPassError('');
    setFormError('');
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const u = username.trim();
    setUserError(u ? '' : 'Username atau email wajib diisi.');
    setPassError(password.length >= 6 ? '' : 'Password minimal 6 karakter.');
    setFormError('');
    if (!u || password.length < 6) return;
    const user = login(u, password, remember);
    if (!user) {
      setFormError('Username atau password salah.');
      return;
    }
    onSuccess(user);
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-basedash">
      <form onSubmit={submit} noValidate className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-[400px]">
        <div className="flex gap-2.5 items-center text-primary text-[17px] font-bold">
          <span className="w-8 h-8 rounded-lg bg-primary grid place-items-center text-white not-italic">
            🐬
          </span>
          PT Tirya Lumba
        </div>
        <h1 className="text-[26px] leading-[34px] mt-3.5 mb-1">Masuk ke dashboard</h1>
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

        <Button type="submit" className="w-full py-2.5">
          Masuk
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
        </div>
      </form>
    </div>
  );
}
