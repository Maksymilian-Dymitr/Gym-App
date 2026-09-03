import { Link } from 'react-router-dom';
import SetLogger from './dashboard/SetLogger';

export default function SetLoggerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">LOG SETS</h1>
        <p className="text-text-secondary text-sm mt-2 uppercase tracking-wider font-bold">Track every rep and weight</p>
      </div>
      <SetLogger />
    </div>
  );
}
