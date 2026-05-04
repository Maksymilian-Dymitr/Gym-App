import { type Sets, type ExerciseCatalog } from "../gym";

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
  getAllSets(): Promise<Sets[]>;
  removeSet(id: string): Promise<boolean>;
}
