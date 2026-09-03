import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts } from '../api/workouts';
import { getSets } from '../api/sets';
import { getBodyWeightLogs } from '../api/bodyweight';
import { getAllExercises } from '../api/exercises';
import type { Workout, ExerciseSet, ExerciseCatalog } from '../types/exercise';
import type { BodyWeightLog } from '../types/bodyweight';
import Sparkline from '../components/ui/Sparkline';
import Spinner from '../components/ui/Spinner';

interface DashData {
  workouts: Workout[];
  sets: ExerciseSet[];
  logs: BodyWeightLog[];
  exercises: ExerciseCatalog[];
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'GOOD MORNING';
  if (h < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function VolumeBarChart({ workouts }: { workouts: Workout[] }) {
  const recent = [...workouts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  if (recent.length === 0) {
    return (
      <div className="h-28 flex items-center justify-center">
        <p className="text-muted text-xs font-black uppercase tracking-wider">No workout data yet</p>
      </div>
    );
  }

  const maxVol = Math.max(...recent.map(w => w.total_workout_volume), 1);

  return (
    <div className="flex items-end gap-1.5 h-28">
      {recent.map((w, i) => {
        const heightPct = Math.max((w.total_workout_volume / maxVol) * 100, 4);
        const isLatest = i === recent.length - 1;
        return (
          <div key={w.id} className="flex flex-col items-center gap-1 flex-1 group" title={`${w.title}: ${w.total_workout_volume.toFixed(0)} kg`}>
            <span className="text-[9px] font-black text-muted opacity-0 group-hover:opacity-100 transition-opacity leading-none">
              {w.total_workout_volume.toFixed(0)}
            </span>
            <div
              className="w-full rounded-t transition-all duration-300"
              style={{
                height: `${heightPct}%`,
                background: isLatest ? '#C9A227' : '#8B0000',
                opacity: isLatest ? 1 : 0.6 + (i / recent.length) * 0.4,
              }}
            />
            <span className="text-[9px] font-black text-muted uppercase leading-none" style={{ writingMode: 'initial' }}>
              {new Date(w.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeightLineChart({ logs }: { logs: BodyWeightLog[] }) {
  const sorted = [...logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12);

  if (sorted.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center">
        <p className="text-muted text-xs font-black uppercase tracking-wider">Log 2+ entries to see chart</p>
      </div>
    );
  }

  const W = 500, H = 90, PAD = 10;
  const weights = sorted.map(l => l.body_weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const pts = sorted.map((l, i) => ({
    x: PAD + (i / (sorted.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((l.body_weight - minW) / range) * (H - PAD * 2),
    val: l.body_weight,
  }));

  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const fillPoints = `${linePoints} ${last.x},${H + 4} ${first.x},${H + 4}`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: '112px' }}>
        <defs>
          <linearGradient id="dash-weight-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPoints} fill="url(#dash-weight-grad)" />
        <polyline points={linePoints} fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#0E0E0E" stroke="#C9A227" strokeWidth="2" />
            {i === pts.length - 1 && (
              <circle cx={p.x} cy={p.y} r="5" fill="#C9A227" opacity="0.3" />
            )}
          </g>
        ))}
      </svg>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] font-black text-muted uppercase">{new Date(sorted[0]!.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span className="text-[10px] font-black text-muted uppercase">{new Date(sorted[sorted.length - 1]!.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashData>({ workouts: [], sets: [], logs: [], exercises: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getWorkouts(), getSets(), getBodyWeightLogs(), getAllExercises()])
      .then(([wr, sr, lr, er]) => setData({
        workouts:  wr.status === 'fulfilled' ? wr.value : [],
        sets:      sr.status === 'fulfilled' ? sr.value : [],
        logs:      lr.status === 'fulfilled' ? lr.value : [],
        exercises: er.status === 'fulfilled' ? er.value : [],
      }))
      .finally(() => setLoading(false));
  }, []);

  const sortedLogs = [...data.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedWorkouts = [...data.workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentSets = data.sets.slice(0, 6);

  const latestWeight = sortedLogs[0];
  const prevWeight = sortedLogs[1];
  const weightDiff = latestWeight && prevWeight ? latestWeight.body_weight - prevWeight.body_weight : null;

  const name = user?.email?.split('@')[0]?.toUpperCase() ?? '';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted font-black mb-1">{greeting()}</p>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">{name}</h1>
        <p className="text-text-secondary text-sm mt-3 uppercase tracking-wider">{today}</p>
      </div>

      {/* Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Link to="/history" className="bg-surface border-t-4 border-primary p-5 rounded hover:border-primary-hover group transition-all">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">WORKOUTS</p>
          <p className="text-5xl font-black text-white group-hover:text-gold transition-colors leading-none">{data.workouts.length}</p>
          <p className="text-muted text-xs mt-2 font-black">ALL TIME</p>
          <p className="text-gold text-xs font-black uppercase tracking-wider mt-5">View All →</p>
        </Link>

        <Link to="/dashboard/sets" className="bg-surface border-t-4 border-gold p-5 rounded hover:border-gold-muted group transition-all">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">SETS LOGGED</p>
          <p className="text-5xl font-black text-white group-hover:text-gold transition-colors leading-none">{data.sets.length}</p>
          <p className="text-muted text-xs mt-2 font-black">ALL TIME</p>
          <p className="text-gold text-xs font-black uppercase tracking-wider mt-5">Log Set →</p>
        </Link>

        <Link to="/dashboard/bodyweight" className="bg-surface border-t-4 border-primary p-5 rounded hover:border-primary-hover group transition-all">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">BODY WEIGHT</p>
          {latestWeight ? (
            <>
              <p className="text-4xl font-black text-white group-hover:text-gold transition-colors leading-none">
                {latestWeight.body_weight}<span className="text-xl text-muted"> kg</span>
              </p>
              {weightDiff !== null && (
                <p className={`text-xs mt-2 font-black ${weightDiff < 0 ? 'text-green-400' : weightDiff > 0 ? 'text-red-400' : 'text-muted'}`}>
                  {weightDiff > 0 ? '▲' : weightDiff < 0 ? '▼' : '—'} {Math.abs(weightDiff).toFixed(1)} KG
                </p>
              )}
            </>
          ) : (
            <p className="text-3xl font-black text-muted leading-none">—</p>
          )}
          <p className="text-gold text-xs font-black uppercase tracking-wider mt-5">Track →</p>
        </Link>

        <Link to="/dashboard/exercises" className="bg-surface border-t-4 border-gold p-5 rounded hover:border-gold-muted group transition-all">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">EXERCISES</p>
          <p className="text-5xl font-black text-white group-hover:text-gold transition-colors leading-none">{data.exercises.length}</p>
          <p className="text-muted text-xs mt-2 font-black">IN CATALOG</p>
          <p className="text-gold text-xs font-black uppercase tracking-wider mt-5">Browse →</p>
        </Link>
      </div>

      {/* ── GRAPHS ROW ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">

        {/* Volume Bar Chart */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted-border">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest">VOLUME PER SESSION</h2>
              <p className="text-muted text-[10px] font-black uppercase tracking-wider mt-0.5">LAST 10 WORKOUTS</p>
            </div>
            <Link to="/progress" className="text-gold text-xs font-black uppercase tracking-wider hover:text-gold-muted transition-colors">
              Full Chart →
            </Link>
          </div>
          <div className="px-5 py-4">
            <VolumeBarChart workouts={data.workouts} />
            {sortedWorkouts[0] && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-muted-border">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-black">LAST SESSION</p>
                  <p className="text-white font-black text-sm mt-0.5 truncate max-w-[160px]">{sortedWorkouts[0].title.toUpperCase()}</p>
                </div>
                <p className="text-gold font-black text-xl">{sortedWorkouts[0].total_workout_volume.toFixed(0)}<span className="text-muted text-sm"> kg</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Weight Line Chart */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted-border">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest">WEIGHT TREND</h2>
              <p className="text-muted text-[10px] font-black uppercase tracking-wider mt-0.5">LAST 12 ENTRIES</p>
            </div>
            <Link to="/dashboard/bodyweight" className="text-gold text-xs font-black uppercase tracking-wider hover:text-gold-muted transition-colors">
              Track →
            </Link>
          </div>
          <div className="px-5 py-4">
            <WeightLineChart logs={data.logs} />
            {latestWeight && (
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-muted-border">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-black">CURRENT</p>
                  <p className="text-gold font-black text-xl mt-0.5">{latestWeight.body_weight} <span className="text-muted text-sm">kg</span></p>
                </div>
                {weightDiff !== null && (
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-muted font-black">VS PREVIOUS</p>
                    <p className={`font-black text-xl mt-0.5 ${weightDiff < 0 ? 'text-green-400' : weightDiff > 0 ? 'text-red-400' : 'text-muted'}`}>
                      {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} <span className="text-sm">kg</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY ROW ─────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">

        {/* Recent Workouts */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted-border">
            <h2 className="text-xs font-black uppercase tracking-widest">RECENT WORKOUTS</h2>
            <Link to="/history" className="text-gold text-xs font-black uppercase tracking-wider hover:text-gold-muted transition-colors">All →</Link>
          </div>
          {sortedWorkouts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-muted text-sm font-black uppercase tracking-wider">No workouts yet</p>
              <Link to="/dashboard/workouts" className="text-gold text-xs font-black uppercase tracking-wider mt-3 inline-block">Build Your First →</Link>
            </div>
          ) : (
            <div className="divide-y divide-muted-border">
              {sortedWorkouts.slice(0, 5).map(w => (
                <div key={w.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-raised transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate">{w.title.toUpperCase()}</p>
                    <p className="text-muted text-xs font-black uppercase tracking-wider mt-0.5">
                      {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-black text-sm">{w.total_workout_volume.toFixed(0)}<span className="text-muted text-xs font-normal"> kg</span></p>
                    {w.sets && <p className="text-muted text-xs">{w.sets.length} sets</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sets */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-muted-border">
            <h2 className="text-xs font-black uppercase tracking-widest">RECENT SETS</h2>
            <Link to="/dashboard/sets" className="text-gold text-xs font-black uppercase tracking-wider hover:text-gold-muted transition-colors">Log Set →</Link>
          </div>
          {recentSets.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-muted text-sm font-black uppercase tracking-wider">No sets logged yet</p>
              <Link to="/dashboard/sets" className="text-gold text-xs font-black uppercase tracking-wider mt-3 inline-block">Log Your First →</Link>
            </div>
          ) : (
            <div className="divide-y divide-muted-border">
              {recentSets.map(s => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-raised transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-white truncate">{s.name.toUpperCase()}</p>
                    <p className="text-muted text-xs font-black">{s.sets}×{s.reps} @ {s.weight} KG</p>
                  </div>
                  <p className="text-gold font-black text-sm">{s.total_exercise_volume}<span className="text-muted text-xs font-normal"> kg</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-muted-border rounded p-5">
        <p className="text-xs font-black uppercase tracking-widest text-muted mb-4">QUICK ACTIONS</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/sets" className="bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors">LOG SET</Link>
          <Link to="/dashboard/workouts" className="bg-surface-raised border border-muted-border hover:border-gold text-text font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors">BUILD WORKOUT</Link>
          <Link to="/dashboard/bodyweight" className="bg-surface-raised border border-muted-border hover:border-gold text-text font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors">LOG WEIGHT</Link>
          <Link to="/progress" className="bg-surface-raised border border-muted-border hover:border-gold text-text font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-colors">VIEW PROGRESS</Link>
        </div>
      </div>
    </div>
  );
}
