import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api/workouts';
import type { Workout } from '../types/exercise';
import Spinner from '../components/ui/Spinner';

function groupByMonth(workouts: Workout[]): Record<string, Workout[]> {
  return workouts.reduce<Record<string, Workout[]>>((acc, w) => {
    const key = new Date(w.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(w);
    return acc;
  }, {});
}

export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getWorkouts()
      .then(w => setWorkouts([...w].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalVolume = workouts.reduce((acc, w) => acc + w.total_workout_volume, 0);
  const grouped = groupByMonth(workouts);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">
          WORKOUT HISTORY
        </h1>
        {!loading && (
          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-3xl font-black text-gold leading-none">{workouts.length}</p>
              <p className="text-xs uppercase tracking-widest text-muted font-black mt-1">TOTAL WORKOUTS</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white leading-none">{(totalVolume / 1000).toFixed(1)}t</p>
              <p className="text-xs uppercase tracking-widest text-muted font-black mt-1">TOTAL VOLUME</p>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="border border-red-800 bg-red-900/20 rounded p-4 text-red-400 text-sm font-bold">{error}</div>
      )}

      {!loading && workouts.length === 0 && (
        <div className="text-center py-20 border border-muted-border rounded bg-surface">
          <p className="text-muted font-black uppercase tracking-wider text-sm">No workouts yet</p>
          <Link to="/dashboard/workouts" className="text-gold text-xs font-black uppercase tracking-wider mt-4 inline-block">
            Build Your First →
          </Link>
        </div>
      )}

      {!loading && Object.entries(grouped).map(([month, ws]) => (
        <div key={month} className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted">{month.toUpperCase()}</h2>
            <div className="flex-1 h-px bg-muted-border" />
            <span className="text-xs font-black uppercase tracking-widest text-muted">{ws.length} SESSIONS</span>
          </div>

          <div className="space-y-2">
            {ws.map(w => (
              <div key={w.id} className="bg-surface border border-muted-border rounded hover:border-gold/30 transition-colors group">
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    <p className="text-xl font-black text-white leading-none">
                      {new Date(w.date).getDate()}
                    </p>
                    <p className="text-xs font-black uppercase tracking-wider text-muted mt-0.5">
                      {new Date(w.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </p>
                  </div>

                  <div className="w-px h-10 bg-muted-border" />

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-base truncate group-hover:text-gold transition-colors">
                      {w.title.toUpperCase()}
                    </p>
                    {w.sets && (
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mt-0.5">
                        {w.sets.length} SETS
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-gold font-black text-lg leading-none">
                      {w.total_workout_volume.toFixed(0)}<span className="text-sm text-muted font-normal"> kg</span>
                    </p>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mt-0.5">VOLUME</p>
                  </div>
                </div>

                {w.sets && w.sets.length > 0 && (
                  <div className="border-t border-muted-border px-5 py-3 bg-surface-raised">
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(w.sets.map(s => s.name))].slice(0, 5).map(name => (
                        <Link
                          key={name}
                          to={`/exercises/${encodeURIComponent(name)}`}
                          className="text-xs font-black uppercase tracking-wider text-muted hover:text-gold transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          {name}
                        </Link>
                      ))}
                      {w.sets.length > 5 && (
                        <span className="text-xs font-black uppercase tracking-wider text-muted">
                          +{w.sets.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
