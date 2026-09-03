import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const BACKEND_URL = 'http://localhost:3001';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left accent */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-surface border-r border-muted-border px-16">
        <Link to="/">
          <span className="font-black text-2xl tracking-[0.3em] uppercase">HERC<span className="text-primary">U</span>LES</span>
        </Link>
        <h2 className="text-5xl font-black mt-12 leading-tight tracking-tight">
          EVERY REP<br />COUNTS.
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed max-w-sm">
          Log in to resume your training and keep your momentum going.
        </p>
        <div className="flex gap-8 mt-12">
          <div>
            <p className="text-3xl font-black text-gold">∞</p>
            <p className="text-xs uppercase tracking-widest text-muted font-black mt-1">WORKOUTS</p>
          </div>
          <div>
            <p className="text-3xl font-black text-gold">100%</p>
            <p className="text-xs uppercase tracking-widest text-muted font-black mt-1">FREE</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <Link to="/">
              <span className="font-black text-xl tracking-[0.3em] uppercase">HERC<span className="text-primary">U</span>LES</span>
            </Link>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-1">WELCOME BACK</h1>
          <p className="text-muted text-sm font-bold uppercase tracking-wider mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />

            {error && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-muted-border" />
            <span className="text-xs text-muted font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-muted-border" />
          </div>

          <a
            href={`${BACKEND_URL}/login/google`}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-black text-xs uppercase tracking-wider py-3 px-4 rounded transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </a>

          <p className="text-center text-muted text-xs font-bold uppercase tracking-wider mt-8">
            No account?{' '}
            <Link to="/signup" className="text-gold hover:text-gold-muted transition-colors">
              SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
