import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllExercises } from '../../api/exercises';
import type { ExerciseCatalog as ExerciseCatalogType } from '../../types/exercise';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function ExerciseCatalog() {
  const [exercises, setExercises] = useState<ExerciseCatalogType[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ExerciseCatalogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllExercises()
      .then(setExercises)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = exercises.filter(ex => {
    const q = search.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.muscleGroups.some(m => m.toLowerCase().includes(q)) ||
      ex.equipment.some(e => e.toLowerCase().includes(q))
    );
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-xs font-black uppercase tracking-wider mb-4">{error}</div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="SEARCH BY NAME, MUSCLE, OR EQUIPMENT…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-lg bg-surface-raised border border-muted-border rounded px-4 py-3 text-sm text-text placeholder-muted focus:outline-none focus:border-gold transition-colors font-bold uppercase tracking-wider"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted font-black">
          {filtered.length} EXERCISE{filtered.length !== 1 ? 'S' : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-muted-border rounded bg-surface">
          <p className="text-muted font-black uppercase tracking-wider text-sm">
            {search ? 'No exercises match your search.' : 'No exercises in the catalog yet.'}
          </p>
        </div>
      ) : (
        <div className="border border-muted-border rounded overflow-hidden divide-y divide-muted-border">
          {filtered.map(ex => (
            <div
              key={ex.name}
              className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 px-5 hover:bg-surface transition-colors group"
            >
              <button
                onClick={() => setSelected(ex)}
                className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 text-left cursor-pointer"
              >
                <span className="font-black text-white group-hover:text-gold transition-colors min-w-[200px]">
                  {ex.name.toUpperCase()}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ex.muscleGroups.map(m => <Badge key={m} label={m} color="gold" />)}
                  {ex.equipment.map(e => <Badge key={e} label={e} color="muted" />)}
                </div>
              </button>
              <Link
                to={`/exercises/${encodeURIComponent(ex.name)}`}
                className="text-xs font-black uppercase tracking-wider text-muted hover:text-gold transition-colors flex-shrink-0"
              >
                History →
              </Link>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">MUSCLE GROUPS</p>
              <div className="flex flex-wrap gap-2">
                {selected.muscleGroups.map(m => <Badge key={m} label={m} color="gold" />)}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">EQUIPMENT</p>
              <div className="flex flex-wrap gap-2">
                {selected.equipment.map(e => <Badge key={e} label={e} color="muted" />)}
              </div>
            </div>
            <Link
              to={`/exercises/${encodeURIComponent(selected.name)}`}
              onClick={() => setSelected(null)}
              className="inline-block text-xs font-black uppercase tracking-wider text-gold hover:text-gold-muted transition-colors mt-2"
            >
              View Full History →
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
