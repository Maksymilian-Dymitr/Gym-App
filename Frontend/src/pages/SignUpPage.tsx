import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignUpPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setError(null);
    setIsLoading(true);
    try {
      await register(email, password);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
          START YOUR<br /><span className="text-gold">JOURNEY.</span>
        </h2>
        <p className="text-text-secondary mt-4 text-base leading-relaxed max-w-sm">
          Create your free account and start logging workouts, tracking body weight, and smashing PRs.
        </p>
        <div className="flex gap-8 mt-12">
          {['TRACK SETS', 'LOG WORKOUTS', 'MEASURE PROGRESS'].map(item => (
            <div key={item}>
              <div className="w-2 h-2 bg-gold rounded-full mb-2" />
              <p className="text-xs uppercase tracking-widest text-muted font-black">{item}</p>
            </div>
          ))}
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

          <h1 className="text-3xl font-black tracking-tight mb-1">CREATE ACCOUNT</h1>
          <p className="text-muted text-sm font-bold uppercase tracking-wider mb-8">Free forever. No credit card.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required autoComplete="new-password" />
            <Input label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required autoComplete="new-password" />

            {error && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-muted text-xs font-bold uppercase tracking-wider mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-muted transition-colors">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
