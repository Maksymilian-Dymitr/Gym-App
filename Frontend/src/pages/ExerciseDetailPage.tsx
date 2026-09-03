import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSets } from '../api/sets';
import { getAllExercises } from '../api/exercises';
import type { ExerciseSet, ExerciseCatalog } from '../types/exercise';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

function ExerciseChart({ sets }: { sets: ExerciseSet[] }) {
  if (sets.length < 2) return null;
  const W = 600, H = 80, PAD = 8;
  const maxW = Math.max(...sets.map(s => s.weight), 1);
  const pts = sets.map((s, i) => ({
    x: PAD + (i / (sets.length - 1)) * (W - PAD * 2),
    y: H - PAD - (s.weight / maxW) * (H - PAD * 2),
  }));
  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const fillPoints = `${linePoints} ${last.x},${H} ${first.x},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ex-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B0000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#ex-grad)" />
      <polyline points={linePoints} fill="none" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C9A227" />
      ))}
    </svg>
  );
}

export default function ExerciseDetailPage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name ?? '');

  const [allSets, setAllSets] = useState<ExerciseSet[]>([]);
  const [exercise, setExercise] = useState<ExerciseCatalog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSets(), getAllExercises()])
      .then(([sets, exercises]) => {
        setAllSets(sets.filter(s => s.name === decodedName));
        setExercise(exercises.find(e => e.name === decodedName) ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [decodedName]);

  const exerciseSets = allSets;
  const bestSet = exerciseSets.reduce<ExerciseSet | null>((best, s) => (!best || s.weight > best.weight ? s : best), null);
  const totalVolume = exerciseSets.reduce((acc, s) => acc + s.total_exercise_volume, 0);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard/exercises" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Exercises
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">
          {decodedName.toUpperCase()}
        </h1>
        {exercise && (
          <div className="flex flex-wrap gap-2 mt-4">
            {exercise.muscleGroups.map(m => <Badge key={m} label={m} color="gold" />)}
            {exercise.equipment.map(e => <Badge key={e} label={e} color="muted" />)}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'SETS LOGGED', value: exerciseSets.length },
          { label: 'BEST WEIGHT', value: bestSet ? `${bestSet.weight} kg` : '—' },
          { label: 'BEST REPS', value: bestSet ? `${bestSet.reps}` : '—' },
          { label: 'TOTAL VOLUME', value: `${totalVolume.toFixed(0)} kg` },
        ].map(s => (
          <div key={s.label} className="bg-surface border-t-4 border-primary rounded p-4">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">{s.label}</p>
            <p className="text-2xl font-black text-white leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {exerciseSets.length === 0 ? (
        <div className="text-center py-16 border border-muted-border rounded bg-surface">
          <p className="text-muted font-black uppercase tracking-wider text-sm">No sets logged for this exercise yet.</p>
          <Link to="/dashboard/sets" className="text-gold text-xs font-black uppercase tracking-wider mt-4 inline-block">
            Log a Set →
          </Link>
        </div>
      ) : (
        <>
          {/* Weight Trend Chart */}
          <div className="bg-surface border border-muted-border rounded overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-muted-border">
              <h2 className="text-xs font-black uppercase tracking-widest">WEIGHT PROGRESSION</h2>
            </div>
            <div className="p-5">
              <ExerciseChart sets={exerciseSets} />
            </div>
          </div>

          {/* All Sets */}
          <div className="bg-surface border border-muted-border rounded overflow-hidden">
            <div className="px-5 py-4 border-b border-muted-border">
              <h2 className="text-xs font-black uppercase tracking-widest">ALL SETS ({exerciseSets.length})</h2>
            </div>
            <div className="divide-y divide-muted-border">
              {exerciseSets.map(s => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-raised transition-colors">
                  <div className="flex-1">
                    <p className="font-black text-sm text-white">
                      {s.sets} <span className="text-muted font-normal">sets</span> × {s.reps} <span className="text-muted font-normal">reps</span> @ <span className="text-gold">{s.weight} kg</span>
                    </p>
                    {s.workout_id && (
                      <p className="text-xs text-muted font-bold uppercase tracking-wider mt-0.5">IN WORKOUT</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-black text-sm">{s.total_exercise_volume}<span className="text-muted text-xs font-normal"> kg total</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
