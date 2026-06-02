import { type Sets, type ExerciseCatalog } from "./gym.type";

export interface CreateSetRequest {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  user_id: string; 
}

export interface ExerciseRepository {
  getExerciseByName(name: string): Promise<ExerciseCatalog | null>;
  getAllExercises(): Promise<ExerciseCatalog[]>;
  createSet(setData: CreateSetRequest): Promise<Sets>;
  getSetById(id: string): Promise<Sets | null>;
  getAllSets(user_id: string): Promise<Sets[]>;
  removeSet(id: string): Promise<boolean>;
}
