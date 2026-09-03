import { useState, useEffect, type FormEvent } from 'react';
import { getAllExercises } from '../../api/exercises';
import { createSet, getSets, deleteSet } from '../../api/sets';
import type { ExerciseCatalog } from '../../types/exercise';
import type { ExerciseSet } from '../../types/exercise';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

export default function SetLogger() {
  const [exercises, setExercises] = useState<ExerciseCatalog[]>([]);
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [setsCount, setSetsCount] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllExercises(), getSets()])
      .then(([exs, s]) => {
        setExercises(exs);
        setSets(s);
        if (exs.length > 0 && exs[0]) setSelectedExercise(exs[0].name);
      })
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const computedVolume = () => {
    const r = Number(reps), w = Number(weight), s = Number(setsCount);
    if (!r || !w || !s) return null;
    return { volume: r * w, total: r * w * s };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const s = Number(setsCount), r = Number(reps), w = Number(weight);
    if (!selectedExercise) return setFormError('Please select an exercise.');
    if (s < 1 || s > 9) return setFormError('Sets must be between 1 and 9.');
    if (r < 1 || r > 29) return setFormError('Reps must be between 1 and 29.');
    if (w < 0) return setFormError('Weight must be 0 or more.');
    setIsSubmitting(true);
    try {
      const result = await createSet({ exercise_name: selectedExercise, sets: s, reps: r, weight: w });
      setSets(prev => [result.newExercise, ...prev]);
      setSetsCount(''); setReps(''); setWeight('');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteSet(id);
      setSets(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const vol = computedVolume();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider">{error}</div>
      )}

      {/* Log form */}
      <div className="bg-surface border border-muted-border rounded p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-5">LOG A SET</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted font-black block mb-1.5">EXERCISE</label>
            <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)}>
              {exercises.length === 0 && <option value="">No exercises available</option>}
              {exercises.map(ex => <option key={ex.name} value={ex.name}>{ex.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Sets (1–9)" type="number" min={1} max={9} value={setsCount} onChange={e => setSetsCount(e.target.value)} placeholder="3" required />
            <Input label="Reps (1–29)" type="number" min={1} max={29} value={reps} onChange={e => setReps(e.target.value)} placeholder="10" required />
            <Input label="Weight (kg)" type="number" min={0} step="0.5" value={weight} onChange={e => setWeight(e.target.value)} placeholder="60" required />
          </div>

          {vol && (
            <div className="flex gap-8 border border-gold/20 bg-gold/5 rounded px-5 py-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted font-black">VOL / SET</p>
                <p className="text-gold font-black text-xl">{vol.volume} <span className="text-sm text-muted">kg</span></p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted font-black">TOTAL</p>
                <p className="text-gold font-black text-xl">{vol.total} <span className="text-sm text-muted">kg</span></p>
              </div>
            </div>
          )}

          {formError && (
            <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">{formError}</div>
          )}

          <Button type="submit" isLoading={isSubmitting} disabled={exercises.length === 0}>
            Log Set
          </Button>
        </form>
      </div>

      {/* Logged sets */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">YOUR SETS</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted border border-muted-border rounded px-2 py-0.5">
            {sets.length}
          </span>
        </div>

        {sets.length === 0 ? (
          <div className="text-center py-16 border border-muted-border rounded bg-surface">
            <p className="text-muted font-black uppercase tracking-wider text-sm">No sets logged yet. Use the form above.</p>
          </div>
        ) : (
          <div className="border border-muted-border rounded overflow-hidden divide-y divide-muted-border">
            {sets.map(s => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 px-5 bg-surface hover:bg-surface-raised transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-sm">{s.name.toUpperCase()}</p>
                  <p className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">
                    {s.sets}×{s.reps} @ {s.weight} KG · <span className="text-gold">{s.total_exercise_volume} KG TOTAL</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.muscleGroups.slice(0, 2).map(m => <Badge key={m} label={m} color="gold" />)}
                  {s.workout_id && <Badge label="In Workout" color="muted" />}
                </div>
                {confirmDeleteId === s.id ? (
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-xs font-bold uppercase">DELETE?</span>
                    <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="text-xs text-red-400 hover:text-red-300 font-black uppercase cursor-pointer disabled:opacity-50">YES</button>
                    <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-muted hover:text-white font-black uppercase cursor-pointer">NO</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(s.id)} className="text-muted hover:text-red-400 transition-colors text-xs font-black uppercase tracking-wider cursor-pointer">
                    REMOVE
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
