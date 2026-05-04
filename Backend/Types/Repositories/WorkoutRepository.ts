import { type Sets, type WorkoutCatalog } from "../gym";

export interface CreateWorkoutRequest {
  title: string;
  creator_id: number;
  exercise_list: Sets[];
  total_workout_volume: number;
}

export interface WorkoutRepository {
  getAllWorkoutsByUserId(user_id: number): Promise<WorkoutCatalog[]>;
  createWorkout(workoutData: CreateWorkoutRequest): Promise<WorkoutCatalog>;
  deleteWorkout(user_id: number, title: string): Promise<boolean>;
  updateWorkout(user_id: number, title: string, updateField: string, updateValue: any): Promise<boolean>;
  getWorkoutByUserIdAndTitle(user_id: number, title: string): Promise<WorkoutCatalog | null>;
}
