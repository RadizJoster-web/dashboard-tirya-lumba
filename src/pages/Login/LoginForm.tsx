import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field } from '../../components/ui';
import BrandLogo from '../../components/layout/BrandLogo';

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  formError: string;
  busy: boolean;
  onSubmit: (credentials: LoginCredentials) => void;
}

export default function LoginForm({
  formError,
  busy,
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [userError, setUserError] = useState('');
  const [passError, setPassError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const u = email.trim();
    const isEmailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(u);
    const isPassValid = password.length >= 6;

    setUserError(isEmailValid ? '' : 'Masukkan alamat email yang valid.');
    setPassError(isPassValid ? '' : 'Password minimal 6 karakter.');

    if (!isEmailValid || !isPassValid) return;

    onSubmit({ email: u, password, remember });
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-[#F3F4F6]">
      <div className="w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <BrandLogo sz={44} />
          <h1 className="font-display text-2xl font-bold text-[#1D3557] mt-3 tracking-tight">
            Tirya Lumba
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dasbor Manajemen Operasional & Pengelola Kolam
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <Field
            id="email"
            label="Alamat Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@tiryalumba.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (userError) setUserError('');
            }}
            error={userError}
          />

          <Field
            id="password"
            label="Kata Sandi"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passError) setPassError('');
            }}
            error={passError}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-[#0077B6]"
              />
              Ingat sesi login
            </label>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-[#FF6F59]">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="w-full justify-center h-11 text-sm font-semibold mt-2"
          >
            {busy ? 'Memverifikasi Akun…' : 'Masuk ke Dasbor'}
          </Button>
        </form>
      </div>
    </div>
  );
}
