import { Link } from 'react-router-dom';
import ExerciseCatalog from './dashboard/ExerciseCatalog';

export default function ExerciseCatalogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-3 leading-none tracking-tight">EXERCISES</h1>
        <p className="text-text-secondary text-sm mt-2 uppercase tracking-wider font-bold">Browse the full catalog</p>
      </div>
      <ExerciseCatalog />
    </div>
  );
}
