export interface ExerciseCatalog {
  id?: string;
  name: string;
  equipment: string[];
  muscleGroups: string[];
}

export interface ExerciseSet {
  id: string;
  name: string;
  equipment: string[];
  muscleGroups: string[];
  sets: number;
  reps: number;
  weight: number;
  volume: number;
  total_exercise_volume: number;
  user_id: string;
  workout_id: string | null;
  created_at: string;
}

export interface Workout {
  id: string;
  title: string;
  creator_id: string;
  user_id: string;
  date: string;
  duration_minutes: number | null;
  total_workout_volume: number;
  created_at: string;
  sets?: ExerciseSet[];
}

export interface CreateSetRequest {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface CreateWorkoutRequest {
  title: string;
  set_ids: string[];
  total_workout_volume: number;
  date?: string;
}
