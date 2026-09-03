import { useState, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { getAllExercises } from '../../api/exercises';
import { createExercise, deleteExercise } from '../../api/admin';
import type { ExerciseCatalog } from '../../types/exercise';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
}: {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) { onAdd(val); setInput(''); }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest text-muted font-black">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type and press Enter"
          className="flex-1 bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-sm focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="button"
          onClick={add}
          className="bg-surface-raised border border-muted-border hover:border-gold text-muted hover:text-gold text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded transition-colors cursor-pointer"
        >
          ADD
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-surface-raised border border-muted-border text-text text-xs px-2.5 py-1 rounded font-black uppercase tracking-wider"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="text-muted hover:text-red-400 cursor-pointer leading-none"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<ExerciseCatalog[]>([]);
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllExercises()
      .then(setExercises)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) return setFormError('Exercise name is required.');
    if (equipment.length === 0) return setFormError('Add at least one piece of equipment.');
    if (muscleGroups.length === 0) return setFormError('Add at least one muscle group.');

    setIsSubmitting(true);
    try {
      const result = await createExercise({ name: name.trim(), equipment, muscleGroups });
      setExercises(prev => [...prev, result.exercise]);
      setName('');
      setEquipment([]);
      setMuscleGroups([]);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (exName: string) => {
    try {
      await deleteExercise(exName);
      setExercises(prev => prev.filter(e => e.name !== exName));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmDeleteName(null);
    }
  };

  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.muscleGroups.some(m => m.toLowerCase().includes(search.toLowerCase())) ||
    e.equipment.some(eq => eq.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider">{error}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create form */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-muted-border">
            <h3 className="text-xs font-black uppercase tracking-widest">ADD EXERCISE</h3>
          </div>
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            <Input
              label="Exercise Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Barbell Bench Press"
              required
            />
            <TagInput
              label="Equipment"
              tags={equipment}
              onAdd={tag => setEquipment(p => [...p, tag])}
              onRemove={tag => setEquipment(p => p.filter(t => t !== tag))}
            />
            <TagInput
              label="Muscle Groups"
              tags={muscleGroups}
              onAdd={tag => setMuscleGroups(p => [...p, tag])}
              onRemove={tag => setMuscleGroups(p => p.filter(t => t !== tag))}
            />
            {formError && (
              <div className="border border-red-800 bg-red-900/20 rounded px-3 py-2.5 text-red-400 text-xs font-black uppercase tracking-wider">{formError}</div>
            )}
            <Button type="submit" isLoading={isSubmitting} className="w-full">Add to Catalog</Button>
          </form>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="bg-surface border border-muted-border rounded p-5">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">TOTAL EXERCISES</p>
            <p className="text-5xl font-black text-white leading-none">{exercises.length}</p>
            <p className="text-muted text-xs font-black uppercase tracking-wider mt-2">IN CATALOG</p>
          </div>
          <div className="bg-surface border border-muted-border rounded p-5">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">MUSCLE GROUPS</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {[...new Set(exercises.flatMap(e => e.muscleGroups))].sort().map(m => (
                <span key={m} className="text-[10px] font-black uppercase tracking-wider text-gold bg-gold/10 border border-gold/20 rounded px-2 py-0.5">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="bg-surface border border-muted-border rounded overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-muted-border">
          <h3 className="text-xs font-black uppercase tracking-widest flex-1">CATALOG</h3>
          <span className="text-xs font-black uppercase tracking-widest text-muted border border-muted-border rounded px-2 py-0.5">{exercises.length}</span>
        </div>

        <div className="px-5 py-3 border-b border-muted-border">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="SEARCH EXERCISES..."
            className="w-full bg-surface-raised border border-muted-border rounded px-3 py-2.5 text-text text-xs font-black uppercase tracking-wider placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-sm font-black uppercase tracking-wider">
              {search ? 'No exercises match your search.' : 'No exercises in catalog yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-muted-border">
            {filtered.map(ex => (
              <div key={ex.name} className="flex items-start gap-4 px-5 py-4 hover:bg-surface-raised transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-white truncate">{ex.name.toUpperCase()}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ex.muscleGroups.map(m => <Badge key={m} label={m} color="gold" />)}
                    {ex.equipment.map(e => <Badge key={e} label={e} color="muted" />)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {confirmDeleteName === ex.name ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-muted text-xs font-black uppercase">DELETE?</span>
                      <button onClick={() => handleDelete(ex.name)} className="text-red-400 font-black text-xs uppercase cursor-pointer hover:text-red-300">YES</button>
                      <button onClick={() => setConfirmDeleteName(null)} className="text-muted text-xs font-black uppercase cursor-pointer">NO</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteName(ex.name)}
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
