import { apiFetch } from './client';
import type { ExerciseCatalog } from '../types/exercise';
import type { AdminUser } from '../types/user';

export function createExercise(data: {
  name: string;
  equipment: string[];
  muscleGroups: string[];
}): Promise<{ message: string; exercise: ExerciseCatalog }> {
  return apiFetch('/exercise', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteExercise(name: string): Promise<{ message: string }> {
  return apiFetch(`/exercises/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export function getUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>('/user');
}

export function createAdminUser(
  newUserEmail: string,
  newUserPassword: string,
): Promise<{ message: string; user: AdminUser }> {
  return apiFetch('/user/create', {
    method: 'POST',
    body: JSON.stringify({ newUserEmail, newUserPassword }),
  });
}

export function updateUser(
  userEmail: string,
  typeOfChange: 'password' | 'role',
  changedData: string,
): Promise<{ message: string }> {
  return apiFetch('/user/update', {
    method: 'POST',
    body: JSON.stringify({ userEmail, typeOfChange, changedData }),
  });
}

export function deleteUser(email: string): Promise<{ message: string }> {
  return apiFetch(`/user/${encodeURIComponent(email)}`, { method: 'DELETE' });
}
