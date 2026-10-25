import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field } from '../../components/ui';

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
    <div className="min-h-screen grid place-items-center p-4 bg-basedash">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-[400px]"
      >
        <img
          src="/logo-mark.svg"
          alt="Logo PT Tirya Lumba"
          width={40}
          height={40}
          draggable={false}
          className="mx-auto w-10 h-10 object-contain"
        />
        <h1 className="text-[26px] leading-[34px] mt-3.5 mb-1">
          Masuk ke Dashboard
        </h1>
        <p className="text-slate-500 mb-5">
          Kelola kolam, jadwal, dan siswa dalam satu tempat.
        </p>

        <Field
          id="email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (userError) setUserError('');
          }}
          error={userError}
        />
        <Field
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passError) setPassError('');
          }}
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
        {formError ? (
          <span className="block text-[#B3341F] text-[13px] font-medium mb-2.5">
            {formError}
          </span>
        ) : null}

        <Button type="submit" className="w-full py-2.5" disabled={busy}>
          {busy ? 'Memproses…' : 'Masuk'}
        </Button>
      </form>
    </div>
  );
}
