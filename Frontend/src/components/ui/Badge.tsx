interface BadgeProps {
  label: string;
  color?: 'gold' | 'muted' | 'red';
}

const colorClasses = {
  gold: 'bg-yellow-900/30 text-gold border border-yellow-700/30',
  muted: 'bg-gray-800/60 text-text-secondary border border-muted-border/50',
  red: 'bg-red-900/30 text-red-400 border border-red-800/30',
};

export default function Badge({ label, color = 'muted' }: BadgeProps) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${colorClasses[color]}`}>
      {label}
    </span>
  );
}
