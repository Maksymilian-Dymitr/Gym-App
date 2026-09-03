import type { AuthUser, Role } from '../types/auth';

const BASE_URL = 'http://localhost:3001';

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: Role };
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: Role };
}

export async function register(email: string, password: string): Promise<{ message: string; user: AuthUser }> {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Registration failed');
  }
  return res.json();
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Login failed');
  }
  return res.json();
}

export async function signout(): Promise<void> {
  await fetch(`${BASE_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function refreshTokens(): Promise<RefreshResponse> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
}
