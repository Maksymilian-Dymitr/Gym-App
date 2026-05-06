import { type WorkoutCatalog } from "./gym.type";

export interface CreateWorkoutRequest {
  title: string;
  creator_id: string;
  user_id: string;
  date: Date;
  total_workout_volume: number;
  duration_minutes?: number;
}

export interface WorkoutRepository {
  getAllWorkoutsByUserId(user_id: string): Promise<WorkoutCatalog[]>;
  createWorkout(workoutData: CreateWorkoutRequest): Promise<WorkoutCatalog>;
  deleteWorkout(user_id: string, title: string): Promise<boolean>;
  updateWorkout(user_id: string, title: string, updateField: string, updateValue: any): Promise<boolean>;
  getWorkoutByUserIdAndTitle(user_id: string, title: string): Promise<WorkoutCatalog | null>;
}
