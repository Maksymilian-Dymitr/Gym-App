import { useState, useEffect, type FormEvent } from 'react';
import { getBodyWeightLogs, createLog, updateLog, deleteLog } from '../../api/bodyweight';
import type { BodyWeightLog } from '../../types/bodyweight';
import Sparkline from '../../components/ui/Sparkline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

export default function BodyWeightTracker() {
  const [logs, setLogs] = useState<BodyWeightLog[]>([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0] ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<BodyWeightLog | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editDate, setEditDate] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sorted[0];
  const prev = sorted[1];
  const diff = latest && prev ? latest.body_weight - prev.body_weight : null;

  useEffect(() => {
    getBodyWeightLogs()
      .then(setLogs)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const w = Number(weight);
    if (!w || w <= 0) return setFormError('Enter a valid weight greater than 0.');
    if (!date) return setFormError('Please select a date.');
    setIsSubmitting(true);
    try {
      const newLog = await createLog(w, new Date(date).toISOString());
      setLogs(prev => [newLog, ...prev]);
      setWeight('');
      setDate(new Date().toISOString().split('T')[0] ?? '');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editingLog) return;
    const w = Number(editWeight);
    if (!w || w <= 0) return;
    try {
      await updateLog(editingLog.id, w, new Date(editDate).toISOString());
      setLogs(prev => prev.map(l => l.id === editingLog.id ? { ...l, body_weight: w, date: new Date(editDate).toISOString() } : l));
      setEditingLog(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current weight + trend */}
        <div className="bg-surface border border-muted-border rounded p-6">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-4">LATEST WEIGHT</p>
          {latest ? (
            <>
              <p className="text-6xl font-black text-white leading-none">
                {latest.body_weight}<span className="text-2xl text-muted"> kg</span>
              </p>
              {diff !== null && (
                <p className={`text-sm font-black uppercase tracking-wider mt-2 ${diff < 0 ? 'text-green-400' : diff > 0 ? 'text-red-400' : 'text-muted'}`}>
                  {diff > 0 ? '▲' : diff < 0 ? '▼' : '—'} {Math.abs(diff).toFixed(1)} KG FROM LAST
                </p>
              )}
              <p className="text-muted text-xs font-bold uppercase tracking-wider mt-1">{formatDate(latest.date)}</p>
              {logs.length >= 2 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">TREND</p>
                  <Sparkline data={logs} />
                </div>
              )}
            </>
          ) : (
            <p className="text-muted font-black uppercase tracking-wider text-sm">No logs yet. Add your first entry.</p>
          )}
        </div>

        {/* Log form */}
        <div className="bg-surface border border-muted-border rounded p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-5">LOG WEIGHT</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Weight (kg)" type="number" step="0.1" min={1} max={500} value={weight} onChange={e => setWeight(e.target.value)} placeholder="75.5" required />
            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            {formError && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">{formError}</div>
            )}
            <Button type="submit" isLoading={isSubmitting} className="w-full">Save Entry</Button>
          </form>
        </div>
      </div>

      {/* Log history */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">HISTORY</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted border border-muted-border rounded px-2 py-0.5">{logs.length}</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-16 border border-muted-border rounded bg-surface">
            <p className="text-muted font-black uppercase tracking-wider text-sm">No entries yet. Log your first weight above.</p>
          </div>
        ) : (
          <div className="border border-muted-border rounded overflow-hidden divide-y divide-muted-border">
            {sorted.map(log => (
              <div key={log.id} className="flex items-center gap-4 py-3.5 px-5 bg-surface hover:bg-surface-raised transition-colors">
                {editingLog?.id === log.id ? (
                  <>
                    <input type="number" value={editWeight} onChange={e => setEditWeight(e.target.value)} className="w-24 bg-surface-raised border border-muted-border rounded px-2 py-1.5 text-sm text-text focus:outline-none focus:border-gold font-bold" step="0.1" />
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="bg-surface-raised border border-muted-border rounded px-2 py-1.5 text-sm text-text focus:outline-none focus:border-gold" />
                    <button onClick={handleEditSave} className="text-gold text-xs font-black uppercase tracking-wider hover:text-gold-muted cursor-pointer ml-auto">SAVE</button>
                    <button onClick={() => setEditingLog(null)} className="text-muted text-xs font-black uppercase cursor-pointer">CANCEL</button>
                  </>
                ) : (
                  <>
                    <span className="font-black text-white text-lg w-24">{log.body_weight} <span className="text-sm text-muted">kg</span></span>
                    <span className="text-muted text-xs font-bold uppercase tracking-wider flex-1">{formatDate(log.date)}</span>
                    <button onClick={() => { setEditingLog(log); setEditWeight(String(log.body_weight)); setEditDate(log.date.split('T')[0] ?? ''); }} className="text-xs text-muted hover:text-gold font-black uppercase tracking-wider cursor-pointer">EDIT</button>
                    {confirmDeleteId === log.id ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-muted text-xs font-bold uppercase">DELETE?</span>
                        <button onClick={() => handleDelete(log.id)} className="text-red-400 font-black text-xs uppercase cursor-pointer">YES</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-muted text-xs font-black uppercase cursor-pointer">NO</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(log.id)} className="text-xs text-muted hover:text-red-400 font-black uppercase tracking-wider cursor-pointer">DELETE</button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
