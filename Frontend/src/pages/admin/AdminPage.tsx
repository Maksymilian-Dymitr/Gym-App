import { useState } from 'react';
import { Link } from 'react-router-dom';
import ExerciseManager from './ExerciseManager';
import UserManager from './UserManager';

type Tab = 'exercises' | 'users';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('exercises');

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-xs uppercase tracking-widest text-muted hover:text-gold font-black transition-colors">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-4 mt-3">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">ADMIN</h1>
          <span className="text-xs font-black uppercase tracking-widest bg-red-900/30 border border-red-700/50 text-red-300 px-3 py-1 rounded">
            RESTRICTED
          </span>
        </div>
        <p className="text-text-secondary text-sm mt-2 uppercase tracking-wider font-bold">Manage exercises and user accounts — changes affect all users</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-muted-border mb-8">
        {([['exercises', 'EXERCISE CATALOG'], ['users', 'USER MANAGEMENT']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer border-b-2 -mb-px
              ${activeTab === id
                ? 'text-white border-primary'
                : 'text-muted border-transparent hover:text-text hover:border-muted-border'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'exercises' && <ExerciseManager />}
      {activeTab === 'users' && <UserManager />}
    </div>
  );
}
