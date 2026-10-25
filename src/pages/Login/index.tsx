import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../../lib/auth';
import { useAuth } from '../../lib/auth-context';
import LoginForm from './LoginForm';
import type { LoginCredentials } from './LoginForm';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin({ email, password, remember }: LoginCredentials) {
    setFormError('');
    setBusy(true);
    const result = await authenticate(email, password, remember);
    setBusy(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    setUser(result.user);
    navigate('/');
  }

  return (
    <LoginForm
      formError={formError}
      busy={busy}
      onSubmit={(creds) => void handleLogin(creds)}
    />
  );
}
