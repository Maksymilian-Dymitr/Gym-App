import { useState, useEffect, type FormEvent } from 'react';
import { getUsers, createAdminUser, updateUser, deleteUser } from '../../api/admin';
import type { AdminUser } from '../../types/user';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

export default function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [updateEmail, setUpdateEmail] = useState('');
  const [updateType, setUpdateType] = useState<'password' | 'role'>('password');
  const [updateValue, setUpdateValue] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setIsCreating(true);
    try {
      const result = await createAdminUser(createEmail, createPassword);
      setUsers(prev => [...prev, result.user]);
      setCreateEmail('');
      setCreatePassword('');
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    if (!updateEmail) return setUpdateError('Email is required.');
    if (!updateValue) return setUpdateError('New value is required.');
    setIsUpdating(true);
    try {
      await updateUser(updateEmail, updateType, updateValue);
      if (updateType === 'role') {
        setUsers(prev => prev.map(u =>
          u.email === updateEmail ? { ...u, role: updateValue as 'User' | 'Admin' } : u,
        ));
      }
      setUpdateEmail('');
      setUpdateValue('');
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      await deleteUser(email);
      setUsers(prev => prev.filter(u => u.email !== email));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmDeleteEmail(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create user */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-muted-border">
            <h3 className="text-xs font-black uppercase tracking-widest">CREATE USER</h3>
          </div>
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            <Input label="Email" type="email" value={createEmail} onChange={e => setCreateEmail(e.target.value)} placeholder="user@example.com" required />
            <Input label="Password" type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} placeholder="Min. 6 characters" required />
            {createError && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">{createError}</div>
            )}
            <Button type="submit" isLoading={isCreating} className="w-full">Create User</Button>
          </form>
        </div>

        {/* Update user */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-muted-border">
            <h3 className="text-xs font-black uppercase tracking-widest">UPDATE USER</h3>
          </div>
          <form onSubmit={handleUpdate} className="p-5 space-y-4">
            <Input label="User Email" type="email" value={updateEmail} onChange={e => setUpdateEmail(e.target.value)} placeholder="target@example.com" required />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">CHANGE</p>
              <div className="flex gap-4">
                {(['password', 'role'] as const).map(type => (
                  <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      value={type}
                      checked={updateType === type}
                      onChange={() => { setUpdateType(type); setUpdateValue(''); }}
                      className="accent-primary"
                    />
                    <span className="text-xs font-black uppercase tracking-wider text-text">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {updateType === 'password' ? (
              <Input label="New Password" type="password" value={updateValue} onChange={e => setUpdateValue(e.target.value)} placeholder="New password" required />
            ) : (
              <div>
                <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">NEW ROLE</p>
                <select value={updateValue} onChange={e => setUpdateValue(e.target.value)} required>
                  <option value="">Select role…</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
            {updateError && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">{updateError}</div>
            )}
            <Button type="submit" isLoading={isUpdating} className="w-full">Apply Change</Button>
          </form>
        </div>
      </div>

      {/* Users list */}
      <div className="bg-surface border border-muted-border rounded overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-muted-border">
          <h3 className="text-xs font-black uppercase tracking-widest flex-1">ALL USERS</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted border border-muted-border rounded px-2 py-0.5">{users.length}</span>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-sm font-black uppercase tracking-wider">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-muted-border">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-raised transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white truncate">{u.email}</p>
                  <p className="text-muted text-xs font-black uppercase tracking-wider mt-0.5">{formatDate(u.created_at)}</p>
                </div>
                <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded border flex-shrink-0 ${
                  u.role === 'Admin'
                    ? 'text-red-300 bg-red-900/20 border-red-700/40'
                    : 'text-muted bg-surface-raised border-muted-border'
                }`}>
                  {u.role}
                </span>
                <div className="flex-shrink-0">
                  {confirmDeleteEmail === u.email ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-muted text-xs font-black uppercase">DELETE?</span>
                      <button onClick={() => handleDelete(u.email)} className="text-red-400 font-black text-xs uppercase cursor-pointer hover:text-red-300">YES</button>
                      <button onClick={() => setConfirmDeleteEmail(null)} className="text-muted text-xs font-black uppercase cursor-pointer">NO</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteEmail(u.email)}
                      className="text-muted hover:text-red-400 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
