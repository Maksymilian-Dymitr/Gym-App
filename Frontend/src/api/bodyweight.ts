import { apiFetch } from './client';
import type { BodyWeightLog } from '../types/bodyweight';

export function getBodyWeightLogs(): Promise<BodyWeightLog[]> {
  return apiFetch<BodyWeightLog[]>('/bodyweight');
}

export function createLog(body_weight: number, date: string): Promise<BodyWeightLog> {
  return apiFetch('/bodyweight', {
    method: 'POST',
    body: JSON.stringify({ body_weight, date }),
  });
}

export function getLog(id: string): Promise<BodyWeightLog> {
  return apiFetch<BodyWeightLog>(`/bodyweight/${id}`);
}

export function updateLog(id: string, body_weight: number, date: string): Promise<{ message: string }> {
  return apiFetch(`/bodyweight/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ body_weight, date }),
  });
}

export function deleteLog(id: string): Promise<{ message: string }> {
  return apiFetch(`/bodyweight/${id}`, { method: 'DELETE' });
}
