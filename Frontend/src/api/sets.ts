import { apiFetch } from './client';
import type { ExerciseSet, CreateSetRequest } from '../types/exercise';

export function createSet(data: CreateSetRequest): Promise<{ newExercise: ExerciseSet }> {
  return apiFetch('/sets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getSets(): Promise<ExerciseSet[]> {
  return apiFetch<ExerciseSet[]>('/sets');
}

export function getSet(id: string): Promise<ExerciseSet> {
  return apiFetch<ExerciseSet>(`/sets/${id}`);
}

export function deleteSet(id: string): Promise<{ message: string }> {
  return apiFetch(`/sets/${id}`, { method: 'DELETE' });
}
