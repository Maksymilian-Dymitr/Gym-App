import { db } from "../DB/mongo";
import { ObjectId } from "mongodb";
import { type Sets, type ExerciseCatalog } from "../Types/gym";
import type { IExerciseRepository, ICreateSetRequest } from "../Types/Repositories/IExerciseRepository";

const exerciseCatalogCollection = db.collection("exercise_catalog");
const setsCollection = db.collection("sets");

export async function getExerciseByName(name: string): Promise<ExerciseCatalog | null> {
  const result = await exerciseCatalogCollection.findOne({ name });
  return result as unknown as ExerciseCatalog | null;
}

export async function getAllExercises(): Promise<ExerciseCatalog[]> {
  const results = await exerciseCatalogCollection.find({}).toArray();
  return results as unknown as ExerciseCatalog[];
}

export async function createSet(setData: ICreateSetRequest): Promise<Sets> {
  const exerciseItem = await exerciseCatalogCollection.findOne({ 
    name: setData.exercise_name 
  });
  
  if (!exerciseItem) {
    throw new Error("Exercise not found in catalog");
  }

  const volumePerSet: number = setData.reps * setData.weight;
  const totalVolume: number = volumePerSet * setData.sets;

  const newSet: Sets = {
    name: exerciseItem.name,
    equipment: exerciseItem.equipment,
    muscleGroups: exerciseItem.muscleGroups,
    performence: [
      {
        sets: setData.sets,
        reps: setData.reps,
        weight: setData.weight,
        volume: volumePerSet,
      },
    ],
    total_exercise_volume: totalVolume,
  };

  const result = await setsCollection.insertOne(newSet);
  return { ...newSet, _id: result.insertedId.toString() } as Sets;
}

export async function getSetById(id: string): Promise<Sets | null> {
  const objectId = new ObjectId(id);
  const result = await setsCollection.findOne({ _id: objectId });
  return result as Sets | null;
}

export async function getAllSets(): Promise<Sets[]> {
  const results = await setsCollection.find({}).toArray();
  return results as unknown as Sets[];
}

export async function removeSet(id: string): Promise<boolean> {
  const objectId = new ObjectId(id);
  const result = await setsCollection.deleteOne({ _id: objectId });
  return result.deletedCount > 0;
}
