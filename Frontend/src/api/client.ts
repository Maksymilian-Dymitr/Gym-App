const BASE_URL = 'http://localhost:3001';

let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function _fetch<T>(path: string, options: RequestInit, retried: boolean): Promise<T> {
  const headers: Record<string, string> = {};

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const mergedHeaders: Record<string, string> = {
    ...headers,
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
    credentials: 'include',
  });

  if (res.status === 401 && !retried) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        _accessToken = data.accessToken;
        return _fetch<T>(path, options, true);
      }
    } catch {}
    _accessToken = null;
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!res.ok) {
    let message = res.statusText || 'Request failed';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return undefined as T;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  return _fetch<T>(path, options, false);
}
