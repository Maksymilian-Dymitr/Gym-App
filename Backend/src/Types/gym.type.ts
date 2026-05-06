export type Equipments = string[];
export type MuscleGroups = string[];

export type ExerciseCatalog = {
  name: string;
  equipment: Equipments;
  muscleGroups: MuscleGroups;
};

export type SetDetails = {
  sets: number;
  reps: number;
  weight: number;
  volume: number;
};

export type Sets = {
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
  created_at: Date;
};

export type WorkoutCatalog = {
  id: string;
  title: string;
  creator_id: string;
  user_id: string;
  date: Date;
  duration_minutes: number | null;
  total_workout_volume: number;
  created_at: Date;
};

export type Workouts = WorkoutCatalog & {
  date: Date;
  creator_id: string; 
  duration_minutes?: number;
};

export type BodyWeightLogs = {
  user_id: string;
  body_weight: number;
  date: Date;
};
