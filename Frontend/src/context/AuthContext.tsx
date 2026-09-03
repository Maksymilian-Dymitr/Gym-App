import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import { login as apiLogin, signout as apiSignout, refreshTokens } from '../api/auth';
import { setAccessToken } from '../api/client';

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (user: AuthUser, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'hercules_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On every mount (including page refresh), call /auth/refresh.
    // The refresh token is an httpOnly cookie — no storage needed.
    // The response now returns the user object directly, so we never
    // depend on sessionStorage / localStorage for identity.
    refreshTokens()
      .then(data => {
        const authUser: AuthUser = { id: data.user.id, email: data.user.email, role: data.user.role };
        setUser(authUser);
        setToken(data.accessToken);
        setAccessToken(data.accessToken);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setToken(null);
        setAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const authUser: AuthUser = { id: data.user.id, email: data.user.email, role: data.user.role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setToken(data.accessToken);
    setAccessToken(data.accessToken);
  };

  const loginWithToken = (authUser: AuthUser, token: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setToken(token);
    setAccessToken(token);
  };

  const logout = async () => {
    try { await apiSignout(); } catch {}
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
