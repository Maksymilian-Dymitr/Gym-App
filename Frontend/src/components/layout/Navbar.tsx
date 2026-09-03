import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
      ? 'text-gold border-b-2 border-gold'
      : 'text-muted hover:text-white border-b-2 border-transparent';

  const navLinks = [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/history', label: 'HISTORY' },
    { to: '/progress', label: 'PROGRESS' },
    { to: '/profile', label: 'PROFILE' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-surface border-b border-muted-border h-14 flex items-center px-4 md:px-8">
      <Link to={user ? '/dashboard' : '/'} className="mr-8 flex-shrink-0" onClick={() => setMenuOpen(false)}>
        <span className="font-black text-lg tracking-[0.25em] uppercase">
          HERC<span className="text-primary">U</span>LES
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-7 flex-1">
        {navLinks.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`text-xs font-black tracking-widest transition-colors pb-0.5 ${isActive(l.to)}`}
          >
            {l.label}
          </Link>
        ))}
        {user?.role === 'Admin' && (
          <Link to="/admin" className={`text-xs font-black tracking-widest transition-colors pb-0.5 ${isActive('/admin')}`}>
            ADMIN
          </Link>
        )}
      </div>

      <div className="hidden md:flex items-center gap-5 ml-auto">
        <span className="text-xs text-muted truncate max-w-[180px]">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="text-xs font-black uppercase tracking-wider text-muted hover:text-red-400 transition-colors cursor-pointer"
        >
          LOGOUT
        </button>
      </div>

      <button
        className="md:hidden ml-auto flex flex-col gap-[5px] cursor-pointer p-2"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-[2px] bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
        <span className={`block w-5 h-[2px] bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-[2px] bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
      </button>

      {menuOpen && (
        <div className="md:hidden absolute top-14 inset-x-0 bg-surface border-b border-muted-border py-5 px-6 flex flex-col gap-5">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-black tracking-widest text-muted hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {user?.role === 'Admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-xs font-black tracking-widest text-muted hover:text-white">
              ADMIN PANEL
            </Link>
          )}
          <div className="border-t border-muted-border pt-4 flex items-center justify-between">
            <span className="text-xs text-muted truncate">{user?.email}</span>
            <button onClick={handleLogout} className="text-xs font-black uppercase tracking-wider text-red-400 hover:text-red-300 cursor-pointer">
              LOGOUT
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
