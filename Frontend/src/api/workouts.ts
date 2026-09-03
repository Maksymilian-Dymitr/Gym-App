import { apiFetch } from './client';
import type { Workout, CreateWorkoutRequest } from '../types/exercise';

export function createWorkout(data: CreateWorkoutRequest): Promise<{ newWorkout: Workout }> {
  return apiFetch('/workout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getWorkouts(): Promise<Workout[]> {
  return apiFetch<Workout[]>('/workouts');
}

// The backend uses the :id param as the workout title for lookup
export function getWorkout(title: string): Promise<Workout> {
  return apiFetch<Workout>(`/workout/${encodeURIComponent(title)}`);
}

// The controller reads title/typeOfChange/changedData from the body; :id param is ignored
export function updateWorkout(
  workoutId: string,
  title: string,
  typeOfChange: string,
  changedData: string | number,
): Promise<{ message: string }> {
  return apiFetch(`/workout/${workoutId}`, {
    method: 'PUT',
    body: JSON.stringify({ title, typeOfChange, changedData }),
  });
}

export function deleteWorkout(id: string): Promise<{ message: string; id: string }> {
  return apiFetch(`/workouts/${id}`, { method: 'DELETE' });
}
