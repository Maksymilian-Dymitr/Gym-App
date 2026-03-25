import { type Sets, type ExerciseCatalog } from "../gym";

export interface ICreateSetRequest {
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface IExerciseRepository {
  getExerciseByName(name: string): Promise<ExerciseCatalog | null>;
  getAllExercises(): Promise<ExerciseCatalog[]>;
  createSet(setData: ICreateSetRequest): Promise<Sets>;
  getSetById(id: string): Promise<Sets | null>;
  getAllSets(): Promise<Sets[]>;
  removeSet(id: string): Promise<boolean>;
}
