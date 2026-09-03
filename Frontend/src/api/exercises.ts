import { apiFetch } from './client';
import type { ExerciseCatalog } from '../types/exercise';

export function getAllExercises(): Promise<ExerciseCatalog[]> {
  return apiFetch<ExerciseCatalog[]>('/exercises');
}

export function getExercise(name: string): Promise<ExerciseCatalog> {
  return apiFetch<ExerciseCatalog>(`/exercise/${encodeURIComponent(name)}`);
}
