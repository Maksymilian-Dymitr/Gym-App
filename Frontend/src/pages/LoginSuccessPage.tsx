import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AuthUser, Role } from '../types/auth';
import Spinner from '../components/ui/Spinner';

export default function LoginSuccessPage() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as Role;
    const email = searchParams.get('email');

    if (token && userId && role && email) {
      const user: AuthUser = { id: userId, email, role };
      loginWithToken(user, token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-text-secondary text-sm">Completing sign in…</p>
    </div>
  );
}
