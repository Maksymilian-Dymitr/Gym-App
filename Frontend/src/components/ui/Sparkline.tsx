import type { BodyWeightLog } from '../../types/bodyweight';

interface SparklineProps {
  data: BodyWeightLog[];
  className?: string;
}

export default function Sparkline({ data, className = '' }: SparklineProps) {
  if (data.length < 2) return null;

  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const weights = sorted.map(d => d.body_weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const W = 300;
  const H = 60;
  const PAD = 6;

  const pts = sorted.map((d, i) => {
    const x = PAD + (i / (sorted.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (d.body_weight - min) / range) * (H - PAD * 2);
    return [x, y] as [number, number];
  });

  const linePoints = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const fillPoints = [
    `${first[0]},${H}`,
    ...pts.map(([x, y]) => `${x},${y}`),
    `${last[0]},${H}`,
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full h-16 ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#spark-grad)" />
      <polyline
        points={linePoints}
        fill="none"
        stroke="#C9A227"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#C9A227" />
      ))}
    </svg>
  );
}
