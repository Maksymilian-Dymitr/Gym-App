import { useState, useEffect, useRef, type FormEvent } from 'react';
import { getAllExercises } from '../../api/exercises';
import { createSet } from '../../api/sets';
import { createWorkout, getWorkouts, deleteWorkout } from '../../api/workouts';
import type { ExerciseCatalog, ExerciseSet, Workout } from '../../types/exercise';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

interface WorkoutEntry {
  key: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
}

let _key = 0;
const nextKey = () => ++_key;

function ExerciseWeightChart({ sets }: { sets: ExerciseSet[] }) {
  if (sets.length === 0) return null;
  const maxByExercise: Record<string, number> = {};
  for (const s of sets) {
    if (!maxByExercise[s.name] || s.weight > maxByExercise[s.name]!) maxByExercise[s.name] = s.weight;
  }
  const entries = Object.entries(maxByExercise);
  const maxWeight = Math.max(...entries.map(([, w]) => w), 1);
  return (
    <div className="mt-3 pt-3 border-t border-muted-border">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">MAX WEIGHT PER EXERCISE</p>
      <div className="space-y-1.5">
        {entries.map(([name, weight]) => (
          <div key={name} className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-muted w-36 truncate flex-shrink-0">{name}</span>
            <div className="flex-1 h-3 bg-surface-raised rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(weight / maxWeight) * 100}%`, background: 'linear-gradient(90deg, #8B0000, #C9A227)' }} />
            </div>
            <span className="text-[10px] font-black text-gold flex-shrink-0 w-14 text-right">{weight} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkoutBuilder() {
  const formRef = useRef<HTMLDivElement>(null);

  const [exercises, setExercises] = useState<ExerciseCatalog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [templateBanner, setTemplateBanner] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0] ?? '');
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  const [selectedExercise, setSelectedExercise] = useState('');
  const [addSets, setAddSets] = useState('3');
  const [addReps, setAddReps] = useState('8');
  const [addWeight, setAddWeight] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([getAllExercises(), getWorkouts()])
      .then(([er, wr]) => {
        const exs = er.status === 'fulfilled' ? er.value : [];
        setExercises(exs);
        setWorkouts(wr.status === 'fulfilled' ? wr.value : []);
        if (exs.length > 0) setSelectedExercise(exs[0]!.name);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddEntry = () => {
    setAddError(null);
    if (!selectedExercise) return setAddError('Pick an exercise.');
    const s = Number(addSets), r = Number(addReps), w = Number(addWeight);
    if (!s || s < 1 || s > 10) return setAddError('Sets must be 1–10.');
    if (!r || r < 1 || r > 30) return setAddError('Reps must be 1–30.');
    if (!w || w <= 0) return setAddError('Enter a valid weight.');
    setEntries(prev => [...prev, { key: nextKey(), exerciseName: selectedExercise, sets: s, reps: r, weight: w }]);
    setAddWeight('');
    setAddReps('8');
    setAddSets('3');
  };

  const removeEntry = (key: number) => setEntries(prev => prev.filter(e => e.key !== key));

  const updateEntryWeight = (key: number, weight: number) =>
    setEntries(prev => prev.map(e => e.key === key ? { ...e, weight } : e));

  const totalVolume = entries.reduce((acc, e) => acc + e.sets * e.reps * e.weight, 0);

  // Load a past workout as a template
  const loadTemplate = (workout: Workout) => {
    if (!workout.sets || workout.sets.length === 0) return;
    setTitle(workout.title);
    setDate(new Date().toISOString().split('T')[0] ?? '');
    setEntries(workout.sets.map(s => ({
      key: nextKey(),
      exerciseName: s.name,
      sets: s.sets,
      reps: s.reps,
      weight: s.weight,
    })));
    setTemplateBanner(workout.title);
    setFormError(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (title.trim().length < 2) return setFormError('Title must be at least 2 characters.');
    if (entries.length === 0) return setFormError('Add at least one exercise.');
    setIsSubmitting(true);
    try {
      const setIds: string[] = [];
      for (const entry of entries) {
        const result = await createSet({ exercise_name: entry.exerciseName, sets: entry.sets, reps: entry.reps, weight: entry.weight });
        setIds.push(result.newExercise.id);
      }
      const result = await createWorkout({
        title: title.trim(),
        set_ids: setIds,
        total_workout_volume: totalVolume,
        date: date ? new Date(date).toISOString() : undefined,
      });
      setWorkouts(prev => [result.newWorkout, ...prev]);
      setTitle('');
      setDate(new Date().toISOString().split('T')[0] ?? '');
      setEntries([]);
      setTemplateBanner(null);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkout(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8">
      {error && <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider">{error}</div>}

      {/* ── Workout creator ─────────────────────────────────────────────── */}
      <div ref={formRef}>
        {templateBanner && (
          <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded px-4 py-2.5 mb-3">
            <p className="text-xs font-black uppercase tracking-wider text-red-300">
              Template loaded: <span className="text-white">{templateBanner}</span> — adjust weights and save
            </p>
            <button onClick={() => { setEntries([]); setTitle(''); setTemplateBanner(null); }} className="text-muted hover:text-white text-xs font-black uppercase cursor-pointer">CLEAR</button>
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="bg-surface border border-muted-border rounded overflow-hidden">

            {/* Title + Date row */}
            <div className="px-5 py-5 border-b border-muted-border grid sm:grid-cols-[1fr_auto] gap-4 items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted mb-3">WORKOUT TITLE</p>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Push Day, Leg Day, Upper Body…"
                  className="w-full bg-transparent text-white text-2xl font-black uppercase tracking-wide placeholder:text-muted/40 focus:outline-none border-b-2 border-muted-border focus:border-gold transition-colors pb-1"
                />
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs font-black uppercase tracking-widest text-muted mb-3">DATE</p>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-sm font-black focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Entry list */}
            {entries.length > 0 && (
              <div className="divide-y divide-muted-border">
                {entries.map((entry, idx) => {
                  const vol = entry.sets * entry.reps * entry.weight;
                  return (
                    <div key={entry.key} className="flex items-center gap-3 px-5 py-3.5 group">
                      <span className="text-muted text-xs font-black w-5 flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm text-white truncate">{entry.exerciseName.toUpperCase()}</p>
                        <p className="text-muted text-xs font-black mt-0.5">{entry.sets} SETS × {entry.reps} REPS</p>
                      </div>
                      {/* Inline weight editor */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <input
                          type="number"
                          value={entry.weight}
                          onChange={e => updateEntryWeight(entry.key, Number(e.target.value))}
                          min={0} step={0.5}
                          className="w-20 bg-surface-raised border border-muted-border rounded px-2 py-1.5 text-gold text-sm font-black text-center focus:outline-none focus:border-gold transition-colors"
                        />
                        <span className="text-muted text-xs font-black">KG</span>
                      </div>
                      <div className="text-right flex-shrink-0 w-20">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted">VOLUME</p>
                        <p className="text-white font-black text-xs leading-tight">{vol.toFixed(0)} <span className="text-muted font-normal">kg</span></p>
                        <p className="text-[9px] text-muted/50 font-black">{entry.sets}×{entry.reps}×{entry.weight}</p>
                      </div>
                      <button type="button" onClick={() => removeEntry(entry.key)}
                        className="text-muted hover:text-red-400 text-xs font-black cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between px-5 py-3 bg-surface-raised">
                  <span className="text-xs font-black uppercase tracking-widest text-muted">{entries.length} EXERCISE{entries.length !== 1 ? 'S' : ''}</span>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted">TOTAL VOLUME</p>
                    <p className="text-gold font-black text-lg leading-tight">{totalVolume.toFixed(0)} <span className="text-sm text-muted font-normal">kg</span></p>
                    <p className="text-[9px] text-muted/50 font-black uppercase">sets × reps × weight</p>
                  </div>
                </div>
              </div>
            )}

            {/* Add exercise */}
            <div className="px-5 py-5 border-t border-muted-border">
              <p className="text-xs font-black uppercase tracking-widest text-muted mb-3">ADD EXERCISE</p>
              {exercises.length === 0 ? (
                <p className="text-muted text-sm font-black uppercase">No exercises in catalog.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-48">
                      <p className="text-xs uppercase tracking-widest text-muted font-black mb-1.5">EXERCISE</p>
                      <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)} className="w-full">
                        {exercises.map(ex => <option key={ex.name} value={ex.name}>{ex.name}</option>)}
                      </select>
                    </div>
                    <div className="w-20">
                      <p className="text-xs uppercase tracking-widest text-muted font-black mb-1.5">SETS</p>
                      <input type="number" value={addSets} onChange={e => setAddSets(e.target.value)} min={1} max={10}
                        className="w-full bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-sm font-black focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div className="w-20">
                      <p className="text-xs uppercase tracking-widest text-muted font-black mb-1.5">REPS</p>
                      <input type="number" value={addReps} onChange={e => setAddReps(e.target.value)} min={1} max={30}
                        className="w-full bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-sm font-black focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <div className="w-28">
                      <p className="text-xs uppercase tracking-widest text-muted font-black mb-1.5">WEIGHT (KG)</p>
                      <input type="number" value={addWeight} onChange={e => setAddWeight(e.target.value)} placeholder="0" min={0} step={0.5}
                        className="w-full bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-sm font-black focus:outline-none focus:border-gold transition-colors" />
                    </div>
                    <button type="button" onClick={handleAddEntry}
                      className="bg-surface-raised border-2 border-muted-border hover:border-gold text-muted hover:text-gold text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded transition-colors cursor-pointer flex-shrink-0 h-[42px]">
                      + ADD
                    </button>
                  </div>
                  {addError && <p className="text-red-400 text-xs font-black uppercase tracking-wider">{addError}</p>}
                </div>
              )}
            </div>

            {/* Submit bar */}
            <div className="px-5 py-4 border-t border-muted-border bg-surface-raised flex items-center justify-between gap-4">
              {formError ? (
                <p className="text-red-400 text-xs font-black uppercase tracking-wider flex-1">{formError}</p>
              ) : entries.length > 0 ? (
                <p className="text-muted text-xs font-black uppercase tracking-wider flex-1">
                  {entries.length} exercise{entries.length !== 1 ? 's' : ''} · total volume {totalVolume.toFixed(0)} kg · {date}
                </p>
              ) : (
                <p className="text-muted text-xs font-black uppercase tracking-wider flex-1">Add exercises above or load a template below</p>
              )}
              <Button type="submit" isLoading={isSubmitting} className="flex-shrink-0">SAVE WORKOUT</Button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Past workouts ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted">PAST WORKOUTS</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted border border-muted-border rounded px-2 py-0.5">{workouts.length}</span>
        </div>

        {sortedWorkouts.length === 0 ? (
          <div className="text-center py-16 border border-muted-border rounded bg-surface">
            <p className="text-muted font-black uppercase tracking-wider text-sm">No workouts yet. Build your first one above.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {sortedWorkouts.map(w => (
              <div key={w.id} className="bg-surface border border-muted-border rounded p-5 hover:border-gold/30 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-black text-white leading-tight">{w.title.toUpperCase()}</h4>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {w.sets && w.sets.length > 0 && (
                      <button
                        onClick={() => loadTemplate(w)}
                        className="text-gold hover:text-gold-muted text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        REPEAT
                      </button>
                    )}
                    {confirmDeleteId === w.id ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-muted text-xs font-black uppercase">DELETE?</span>
                        <button onClick={() => handleDelete(w.id)} className="text-red-400 font-black text-xs uppercase cursor-pointer hover:text-red-300">YES</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-muted text-xs font-black uppercase cursor-pointer">NO</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(w.id)}
                        className="text-muted hover:text-red-400 text-xs font-black uppercase tracking-wider cursor-pointer transition-colors">
                        DELETE
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-black">DATE</p>
                    <p className="text-white font-black text-sm">{formatDate(w.date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted font-black">VOLUME <span className="text-muted/50">(sets×reps×kg)</span></p>
                    <p className="text-gold font-black text-sm">{w.total_workout_volume.toFixed(0)} KG</p>
                  </div>
                  {w.sets && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted font-black">EXERCISES</p>
                      <p className="text-white font-black text-sm">{[...new Set(w.sets.map(s => s.name))].length}</p>
                    </div>
                  )}
                </div>

                {w.sets && w.sets.length > 0 && <ExerciseWeightChart sets={w.sets} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
