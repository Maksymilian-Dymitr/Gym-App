import { db } from "../DB/mongo";
import { type WorkoutCatalog } from "../Types/gym";
import type { IWorkoutRepository, ICreateWorkoutRequest } from "../Types/Repositories/IWorkoutRepository";

const workoutCollection = db.collection("workout_catalog");

export async function getAllWorkoutsByUserId(user_id: number): Promise<WorkoutCatalog[]> {
  const results = await workoutCollection.find({ user_id }).toArray();
  return results as unknown as WorkoutCatalog[];
}

export async function createWorkout(workoutData: ICreateWorkoutRequest): Promise<WorkoutCatalog> {
  const result = await workoutCollection.insertOne(workoutData);
  return { ...workoutData, _id: result.insertedId.toString() } as WorkoutCatalog;
}

export async function deleteWorkout(user_id: number, title: string): Promise<boolean> {
  const result = await workoutCollection.deleteMany({
    user_id,
    title,
  });
  return result.deletedCount > 0;
}

export async function updateWorkout(user_id: number, title: string, updateField: string, updateValue: any): Promise<boolean> {
  const result = await workoutCollection.updateOne(
    { user_id, title },
    {
      $set: { [updateField]: updateValue },
    },
  );
  return result.matchedCount > 0;
}

export async function getWorkoutByUserIdAndTitle(user_id: number, title: string): Promise<WorkoutCatalog | null> {
  const result = await workoutCollection.findOne({ user_id, title });
  return result as unknown as WorkoutCatalog | null;
}
