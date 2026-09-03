import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../api/workouts';
import { getSets } from '../api/sets';
import { getBodyWeightLogs } from '../api/bodyweight';
import type { Workout, ExerciseSet } from '../types/exercise';
import type { BodyWeightLog } from '../types/bodyweight';
import Sparkline from '../components/ui/Sparkline';
import Spinner from '../components/ui/Spinner';

// ── Volume chart ──────────────────────────────────────────────────────────────
function VolumeChart({ workouts }: { workouts: Workout[] }) {
  const sorted = [...workouts]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-20);

  if (sorted.length < 2) {
    return <p className="text-muted text-sm font-bold uppercase tracking-wider text-center py-8">Log at least 2 workouts to see volume trend.</p>;
  }

  const W = 600, H = 100, PAD = 8;
  const maxVol = Math.max(...sorted.map(d => d.total_workout_volume), 1);
  const pts = sorted.map((d, i) => ({
    x: PAD + (i / (sorted.length - 1)) * (W - PAD * 2),
    y: H - PAD - (d.total_workout_volume / maxVol) * (H - PAD * 2),
  }));
  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const fillPoints = `${linePoints} ${pts[pts.length - 1]!.x},${H} ${pts[0]!.x},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="vol-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#vol-grad)" />
      <polyline points={linePoints} fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C9A227" />)}
    </svg>
  );
}

// ── PRs ───────────────────────────────────────────────────────────────────────
function PRs({ sets }: { sets: ExerciseSet[] }) {
  const prMap: Record<string, number> = {};
  for (const s of sets) {
    if (!prMap[s.name] || s.weight > prMap[s.name]!) prMap[s.name] = s.weight;
  }
  const prs = Object.entries(prMap).sort(([, a], [, b]) => b - a).slice(0, 10);
  if (prs.length === 0) return <p className="text-muted text-sm font-bold uppercase tracking-wider text-center py-8">No sets logged yet.</p>;
  const maxW = prs[0]![1];
  return (
    <div className="space-y-3">
      {prs.map(([name, weight]) => (
        <div key={name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-text truncate flex-1 mr-4">{name}</span>
            <span className="text-gold font-black text-sm flex-shrink-0">{weight} <span className="text-xs text-muted font-normal">kg</span></span>
          </div>
          <div className="h-1.5 bg-muted-border rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full" style={{ width: `${(weight / maxW) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Exercise progress chart ───────────────────────────────────────────────────
interface DataPoint { date: string; weight: number }

function ExerciseLineChart({ data }: { data: DataPoint[] }) {
  if (data.length < 2) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-muted text-xs font-black uppercase tracking-wider">Log this exercise at least twice to see a trend</p>
      </div>
    );
  }

  const W = 600, H = 130, PAD_X = 8, PAD_Y = 12;
  const weights = data.map(d => d.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  const pts = data.map((d, i) => ({
    x: PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2),
    y: H - PAD_Y - ((d.weight - minW) / range) * (H - PAD_Y * 2),
    ...d,
  }));

  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const fillPoints = `${linePoints} ${pts[pts.length - 1]!.x},${H + 4} ${pts[0]!.x},${H + 4}`;

  const isImproving = data[data.length - 1]!.weight >= data[0]!.weight;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: '160px' }}>
        <defs>
          <linearGradient id="ex-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B0000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillPoints} fill="url(#ex-fill)" />
        <polyline points={linePoints} fill="none" stroke="#8B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3.5} fill="#0E0E0E" stroke={i === pts.length - 1 ? '#C9A227' : '#8B0000'} strokeWidth="2" />
            {i === pts.length - 1 && <circle cx={p.x} cy={p.y} r="8" fill="#C9A227" opacity="0.15" />}
          </g>
        ))}
      </svg>
      {/* X axis labels */}
      <div className="flex items-center justify-between mt-1 px-1">
        <span className="text-[10px] font-black text-muted uppercase">
          {new Date(data[0]!.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-[10px] font-black text-muted uppercase">
          {new Date(data[data.length - 1]!.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

function ExerciseProgress({ sets, workouts }: { sets: ExerciseSet[]; workouts: Workout[] }) {
  // workout_id → YYYY-MM-DD (the user-set training date, not created_at)
  const workoutDateMap: Record<string, string> = {};
  for (const w of workouts) {
    workoutDateMap[w.id] = w.date.slice(0, 10);
  }

  // Build per-exercise data: group by name, then by day (max weight per day)
  const byExercise: Record<string, DataPoint[]> = {};
  for (const s of sets) {
    // Prefer the workout's training date so REPEAT / seeded workouts spread correctly
    const day = (s.workout_id && workoutDateMap[s.workout_id]) ?? s.created_at.slice(0, 10);
    if (!byExercise[s.name]) byExercise[s.name] = [];
    const existing = byExercise[s.name]!.find(d => d.date === day);
    if (existing) {
      if (s.weight > existing.weight) existing.weight = s.weight;
    } else {
      byExercise[s.name]!.push({ date: day, weight: s.weight });
    }
  }

  // Sort each exercise's data by date
  for (const name of Object.keys(byExercise)) {
    byExercise[name]!.sort((a, b) => a.date.localeCompare(b.date));
  }

  const exerciseNames = Object.keys(byExercise).sort();
  const [selected, setSelected] = useState(exerciseNames[0] ?? '');

  // Update selected when data loads
  useEffect(() => {
    if (!selected && exerciseNames.length > 0) setSelected(exerciseNames[0]!);
  }, [exerciseNames.join(',')]);

  if (exerciseNames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-sm font-black uppercase tracking-wider">No sets logged yet.</p>
        <Link to="/dashboard/workouts" className="text-gold text-xs font-black uppercase tracking-wider mt-3 inline-block">Build a Workout →</Link>
      </div>
    );
  }

  const data = byExercise[selected] ?? [];
  const first = data[0];
  const latest = data[data.length - 1];
  const pr = data.reduce((max, d) => d.weight > max ? d.weight : max, 0);
  const gain = first && latest ? latest.weight - first.weight : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-0">
      {/* Exercise list */}
      <div className="lg:w-56 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-muted-border overflow-y-auto max-h-96 lg:max-h-none">
        {exerciseNames.map(name => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`w-full text-left px-4 py-3 border-b border-muted-border text-xs font-black uppercase tracking-wider transition-colors cursor-pointer last:border-b-0 ${
              selected === name
                ? 'bg-primary/10 text-white border-l-2 border-l-primary'
                : 'text-muted hover:text-white hover:bg-surface-raised'
            }`}
          >
            <span className="truncate block">{name}</span>
            {byExercise[name] && (
              <span className="text-[9px] text-muted/60 font-black mt-0.5 block">
                {byExercise[name]!.length} SESSION{byExercise[name]!.length !== 1 ? 'S' : ''}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chart panel */}
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h3 className="font-black text-white text-base uppercase tracking-tight">{selected}</h3>
            <p className="text-muted text-[10px] font-black uppercase tracking-wider mt-0.5">MAX WEIGHT PER SESSION</p>
          </div>
          <div className="flex gap-5 flex-wrap">
            {first && (
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">STARTED</p>
                <p className="text-white font-black text-base leading-tight">{first.weight} <span className="text-sm text-muted">kg</span></p>
              </div>
            )}
            {latest && (
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">CURRENT</p>
                <p className="text-gold font-black text-base leading-tight">{latest.weight} <span className="text-sm text-muted">kg</span></p>
              </div>
            )}
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">PR</p>
              <p className="text-gold font-black text-base leading-tight">{pr} <span className="text-sm text-muted">kg</span></p>
            </div>
            {gain !== 0 && (
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted">PROGRESS</p>
                <p className={`font-black text-base leading-tight ${gain > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {gain > 0 ? '+' : ''}{gain.toFixed(1)} <span className="text-sm">kg</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <ExerciseLineChart data={data} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [logs, setLogs] = useState<BodyWeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getWorkouts(), getSets(), getBodyWeightLogs()])
      .then(([wr, sr, lr]) => {
        setWorkouts(wr.status === 'fulfilled' ? wr.value : []);
        setSets(sr.status === 'fulfilled' ? sr.value : []);
        setLogs(lr.status === 'fulfilled' ? lr.value : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalVolume = workouts.reduce((acc, w) => acc + w.total_workout_volume, 0);
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestWeight = sortedLogs[0];
  const firstWeight = sortedLogs[sortedLogs.length - 1];
  const totalWeightChange = latestWeight && firstWeight ? latestWeight.body_weight - firstWeight.body_weight : null;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">← Dashboard</Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">PROGRESS</h1>
        <p className="text-text-secondary text-sm mt-2 uppercase tracking-wider font-bold">Your journey at a glance</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'WORKOUTS', value: workouts.length, unit: '' },
          { label: 'TOTAL VOLUME', value: `${(totalVolume / 1000).toFixed(1)}`, unit: 't' },
          { label: 'SETS LOGGED', value: sets.length, unit: '' },
          { label: 'WEIGHT LOGS', value: logs.length, unit: '' },
        ].map(s => (
          <div key={s.label} className="bg-surface border border-muted-border rounded p-4">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">{s.label}</p>
            <p className="text-3xl font-black text-white leading-none">{s.value}<span className="text-lg text-muted">{s.unit}</span></p>
          </div>
        ))}
      </div>

      {/* ── Exercise progress ─────────────────────────────────────────────── */}
      <div className="bg-surface border border-muted-border rounded overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-muted-border">
          <h2 className="text-xs font-black uppercase tracking-widest">EXERCISE PROGRESS</h2>
          <p className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">MAX WEIGHT OVER TIME — SELECT AN EXERCISE</p>
        </div>
        <ExerciseProgress sets={sets} workouts={workouts} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Volume Over Time */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-muted-border">
            <h2 className="text-xs font-black uppercase tracking-widest">WORKOUT VOLUME</h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">LAST 20 SESSIONS</p>
          </div>
          <div className="p-5">
            <VolumeChart workouts={sortedWorkouts} />
            {sortedWorkouts[0] && (
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-black">LAST SESSION</p>
                  <p className="text-white font-black text-sm mt-0.5">{sortedWorkouts[0].title.toUpperCase()}</p>
                </div>
                <p className="text-gold font-black text-xl">{sortedWorkouts[0].total_workout_volume.toFixed(0)}<span className="text-sm text-muted"> kg</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Body Weight Trend */}
        <div className="bg-surface border border-muted-border rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-muted-border">
            <h2 className="text-xs font-black uppercase tracking-widest">BODY WEIGHT TREND</h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">{logs.length} ENTRIES</p>
          </div>
          <div className="p-5">
            {logs.length >= 2 ? (
              <>
                <Sparkline data={logs} />
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted font-black">CURRENT</p>
                    <p className="text-gold font-black text-2xl mt-0.5">{latestWeight!.body_weight} <span className="text-base text-muted">kg</span></p>
                  </div>
                  {totalWeightChange !== null && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-muted font-black">TOTAL CHANGE</p>
                      <p className={`font-black text-2xl mt-0.5 ${totalWeightChange < 0 ? 'text-green-400' : totalWeightChange > 0 ? 'text-red-400' : 'text-muted'}`}>
                        {totalWeightChange > 0 ? '+' : ''}{totalWeightChange.toFixed(1)} <span className="text-base">kg</span>
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted text-sm font-bold uppercase tracking-wider">Log at least 2 weight entries to see trend.</p>
                <Link to="/dashboard/bodyweight" className="text-gold text-xs font-black uppercase tracking-wider mt-3 inline-block">Log Weight →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Records */}
      <div className="bg-surface border border-muted-border rounded overflow-hidden">
        <div className="px-5 py-4 border-b border-muted-border flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest">PERSONAL RECORDS</h2>
            <p className="text-muted text-xs font-bold uppercase tracking-wider mt-0.5">MAX WEIGHT PER EXERCISE</p>
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-muted">
            {Object.keys(sets.reduce<Record<string, boolean>>((a, s) => { a[s.name] = true; return a; }, {})).length} EXERCISES
          </span>
        </div>
        <div className="p-5">
          <PRs sets={sets} />
        </div>
      </div>
    </div>
  );
}
