import { Link } from 'react-router-dom';

const mockBars = [38, 62, 48, 75, 52, 88, 65, 95];

function MockBarChart() {
  return (
    <div className="flex items-end gap-1 h-14">
      {mockBars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t"
          style={{
            height: `${h}%`,
            background: i === mockBars.length - 1 ? '#C9A227' : '#8B0000',
            opacity: 0.85 + (i / mockBars.length) * 0.15,
          }}
        />
      ))}
    </div>
  );
}

const features = [
  {
    num: '01',
    title: 'EXERCISE LIBRARY',
    desc: 'Browse a curated catalog filtered by muscle group and equipment. Click any exercise for full history.',
  },
  {
    num: '02',
    title: 'SET & WORKOUT LOGGING',
    desc: 'Log individual sets with automatic volume calculation, then bundle them into complete workout sessions.',
  },
  {
    num: '03',
    title: 'PROGRESS TRACKING',
    desc: 'Visualise volume trends, body weight charts, and personal records — all in one powerful dashboard.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-12 h-14 bg-background/95 border-b border-muted-border backdrop-blur">
        <span className="font-black text-lg tracking-[0.25em] uppercase">HERC<span className="text-primary">U</span>LES</span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest text-muted hover:text-white transition-colors">
            LOG IN
          </Link>
          <Link to="/signup" className="text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded transition-colors">
            GET STARTED
          </Link>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          {/* Red glow */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 55% 65% at 28% 55%, rgba(139,0,0,0.22) 0%, transparent 70%)' }}
          />
          {/* Gold accent */}
          <div
            className="absolute top-0 right-0 w-1/2 h-2/3"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(201,162,39,0.06) 0%, transparent 65%)' }}
          />
          {/* Left vertical red bar accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full py-16">

          {/* ── Left: copy ── */}
          <div>
            <div
              className="inline-flex items-center gap-2.5 border border-primary/30 bg-primary/5 rounded-full px-4 py-2 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" />
              <span className="text-xs font-black uppercase tracking-widest text-red-300">Track Every Rep. Own Every Gain.</span>
            </div>

            <h1
              className="font-black leading-none tracking-tight animate-fade-in-up"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', animationDelay: '80ms' }}
            >
              <span className="block">OWN</span>
              <span className="block text-gold" style={{ WebkitTextStroke: '1px rgba(201,162,39,0.3)' }}>EVERY</span>
              <span className="block">GAIN.</span>
            </h1>

            <p
              className="text-text-secondary text-base md:text-lg mt-6 max-w-md leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '160ms' }}
            >
              The serious athlete's training companion. Log sets, build workouts, track body weight, and crush personal records.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                to="/signup"
                className="bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest px-9 py-4 rounded transition-colors shadow-lg shadow-primary/25 text-center"
              >
                Start for Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-muted-border hover:border-gold text-muted hover:text-gold font-black text-sm uppercase tracking-widest px-9 py-4 rounded transition-colors text-center"
              >
                Sign In
              </Link>
            </div>

            <div
              className="flex items-center gap-6 mt-12 animate-fade-in-up"
              style={{ animationDelay: '320ms' }}
            >
              {[
                { v: '∞', l: 'WORKOUTS' },
                { v: '100%', l: 'FREE' },
                { v: 'REAL-TIME', l: 'VOLUME' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-8 bg-muted-border" />}
                  <div>
                    <p className="text-xl font-black text-white">{s.v}</p>
                    <p className="text-xs uppercase tracking-widest text-muted font-black">{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: mock UI cards ── */}
          <div className="relative hidden lg:block h-[520px] select-none">

            {/* Card 1 — Workouts stat */}
            <div
              className="absolute top-4 right-0 w-48 bg-surface border-t-4 border-primary rounded p-5 shadow-2xl shadow-black/50 animate-float"
              style={{ animationDelay: '0s' }}
            >
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">WORKOUTS</p>
              <p className="text-5xl font-black text-white leading-none">147</p>
              <p className="text-muted text-xs font-black uppercase mt-1">ALL TIME</p>
              <p className="text-gold text-xs font-black uppercase tracking-wider mt-5">View All →</p>
            </div>

            {/* Card 2 — Body weight */}
            <div
              className="absolute top-48 left-4 w-52 bg-surface border-t-4 border-gold rounded p-5 shadow-2xl shadow-black/50 animate-float"
              style={{ animationDelay: '1.2s' }}
            >
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">BODY WEIGHT</p>
              <p className="text-4xl font-black text-white leading-none">
                82.5 <span className="text-xl text-muted">kg</span>
              </p>
              <p className="text-green-400 text-xs font-black uppercase tracking-wider mt-2">▼ 0.5 KG FROM LAST</p>
              <p className="text-gold text-xs font-black uppercase tracking-wider mt-4">Track →</p>
            </div>

            {/* Card 3 — Volume chart */}
            <div
              className="absolute bottom-12 right-4 w-60 bg-surface border border-muted-border rounded overflow-hidden shadow-2xl shadow-black/50 animate-float"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="px-4 py-3 border-b border-muted-border flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest">VOLUME TREND</p>
                <p className="text-gold text-xs font-black">↑ 12%</p>
              </div>
              <div className="p-4">
                <MockBarChart />
                <div className="flex items-end justify-between mt-3">
                  <div>
                    <p className="text-gold font-black text-xl leading-none">1,240 <span className="text-sm text-muted">kg</span></p>
                    <p className="text-xs text-muted font-black uppercase tracking-wider mt-0.5">THIS WEEK</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="w-2 h-2 bg-gold rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 — Sets */}
            <div
              className="absolute top-28 right-48 w-36 bg-surface border-t-4 border-primary rounded p-4 shadow-xl shadow-black/50 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <p className="text-xs uppercase tracking-widest text-muted font-black mb-2">SETS</p>
              <p className="text-4xl font-black text-white leading-none">543</p>
              <p className="text-muted text-xs font-black uppercase mt-1">LOGGED</p>
            </div>

            {/* Connecting lines (purely decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 400 520">
              <line x1="200" y1="60" x2="100" y2="220" stroke="#C9A227" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="100" y1="280" x2="230" y2="370" stroke="#8B0000" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-muted-border to-transparent" />
          <span className="text-muted text-[10px] font-black uppercase tracking-[0.3em]">SCROLL</span>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <section className="bg-surface border-y border-muted-border py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '∞', label: 'WORKOUTS' },
            { value: 'FULL', label: 'EXERCISE CATALOG' },
            { value: 'REAL-TIME', label: 'VOLUME TRACKING' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-gold font-black text-2xl md:text-4xl">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted font-black mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">WHAT YOU GET</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              EVERYTHING TO<br /><span className="text-gold">DOMINATE</span> YOUR TRAINING
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-muted-border border border-muted-border rounded overflow-hidden">
            {features.map(f => (
              <div key={f.num} className="bg-background p-8 hover:bg-surface transition-colors group">
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-6">{f.num}</p>
                <h3 className="font-black text-sm uppercase tracking-tight mb-3 group-hover:text-gold transition-colors">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="bg-surface border-y border-muted-border py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-muted font-black mb-3">HOW IT WORKS</p>
            <h2 className="text-4xl font-black tracking-tight">UP AND RUNNING IN <span className="text-gold">MINUTES</span></h2>
          </div>
          <div className="space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {[
              { num: '01', title: 'CREATE AN ACCOUNT', desc: 'Sign up with email or Google in under a minute.' },
              { num: '02', title: 'LOG YOUR SETS', desc: 'Pick an exercise, enter sets, reps, and weight. Volume is calculated automatically.' },
              { num: '03', title: 'BUILD WORKOUTS', desc: 'Group your sets into a named session and track total volume over time.' },
            ].map((step, i) => (
              <div key={i} className="flex md:flex-col gap-6 py-6 md:py-0 border-b md:border-b-0 border-muted-border last:border-b-0">
                <div className="flex-shrink-0 text-4xl font-black text-primary">{step.num}</div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(139,0,0,0.13) 0%, transparent 70%)' }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted font-black mb-4">START TODAY</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-none">
            READY TO TRAIN<br /><span className="text-gold">SMARTER?</span>
          </h2>
          <p className="text-text-secondary text-base mb-8 leading-relaxed">
            Join Hercules and take full control of your training journey.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-primary hover:bg-primary-hover text-white font-black text-sm uppercase tracking-widest px-12 py-5 rounded transition-colors shadow-xl shadow-primary/25"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="bg-surface border-t border-muted-border py-6 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted font-black">
          © {new Date().getFullYear()} HERCULES — BUILT FOR ATHLETES
        </p>
      </footer>
    </div>
  );
}
