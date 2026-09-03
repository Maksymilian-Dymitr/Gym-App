import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../api/workouts';
import { getSets } from '../api/sets';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function ProfilePage() {
  const { user } = useAuth();
  const [workoutCount, setWorkoutCount] = useState<number | null>(null);
  const [setCount, setSetCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getWorkouts(), getSets()])
      .then(([w, s]) => { setWorkoutCount(w.length); setSetCount(s.length); })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (newPassword.length < 6) return setPwError('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setPwError('Passwords do not match.');
    setPwLoading(true);
    try {
      await apiFetch('/user/update', {
        method: 'POST',
        body: JSON.stringify({ email: user?.email, typeOfChange: 'password', changedData: newPassword }),
      });
      setPwSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password. Admin access may be required.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">PROFILE</h1>
      </div>

      {/* Identity Card */}
      <div className="bg-surface border-l-4 border-primary rounded p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-14 h-14 rounded bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="text-2xl font-black text-white">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-1">EMAIL</p>
            <p className="text-white font-black text-lg">{user?.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded ${user?.role === 'Admin' ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-surface-raised text-muted border border-muted-border'}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'WORKOUTS', value: statsLoading ? '…' : workoutCount },
          { label: 'SETS LOGGED', value: statsLoading ? '…' : setCount },
          { label: 'MEMBER SINCE', value: '2024' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-muted-border rounded p-4">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">{s.label}</p>
            {statsLoading && s.label !== 'MEMBER SINCE' ? (
              <Spinner size="sm" />
            ) : (
              <p className="text-2xl font-black text-white">{s.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Password Change */}
      <div className="bg-surface border border-muted-border rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-muted-border">
          <h2 className="text-xs font-black uppercase tracking-widest">CHANGE PASSWORD</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />

          {pwError && (
            <p className="text-red-400 text-xs font-black uppercase tracking-wider border border-red-800 bg-red-900/20 rounded px-3 py-2">
              {pwError}
            </p>
          )}
          {pwSuccess && (
            <p className="text-green-400 text-xs font-black uppercase tracking-wider border border-green-800 bg-green-900/20 rounded px-3 py-2">
              ✓ PASSWORD UPDATED SUCCESSFULLY
            </p>
          )}

          <Button type="submit" isLoading={pwLoading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
