import type { Sets, ExerciseCatalog } from "../Types/gym";
import type { CreateSetRequest } from "../Types/Repositories/ExerciseRepository";

import { prisma } from "../Lib/prisma";

export async function getExerciseByName(
  name: string
): Promise<ExerciseCatalog | null> {
  return prisma.exerciseCatalog.findUnique({
    where: { name },
  });
}


export async function getAllExercises(): Promise<ExerciseCatalog[]> {
  return prisma.exerciseCatalog.findMany();
}

export async function createSet(setData: CreateSetRequest): Promise<Sets> {
  const exerciseItem = await prisma.exerciseCatalog.findUnique({
    where: { name: setData.exercise_name },
  });

  if (!exerciseItem) {
    throw new Error("Exercise not found in catalog");
  }

  const volumePerSet = setData.reps * setData.weight;
  const totalVolume = volumePerSet * setData.sets;

  return prisma.set.create({
    data: {
      name: exerciseItem.name,
      equipment: exerciseItem.equipment,
      muscleGroups: exerciseItem.muscleGroups,

      sets: setData.sets,
      reps: setData.reps,
      weight: setData.weight,
      volume: volumePerSet,
      total_exercise_volume: totalVolume,

      user_id: setData.user_id,
    },
  });
}

export async function getSetById(id: string): Promise<Sets | null> {
  return prisma.set.findUnique({
    where: { id },
  });
}

export async function getAllSets(): Promise<Sets[]> {
  return prisma.set.findMany();
}

export async function removeSet(id: string): Promise<boolean> {
  try {
    await prisma.set.delete({
      where: { id },
    });

    return true;
  } catch {
    return false;
  }
}


export function createExercise(data: {
  name: string;
  equipment: string[];
  muscleGroups: string[];
}) {
  return prisma.exerciseCatalog.create({
    data,
  });
}

export async function deleteExerciseByName(name: string) {
  return prisma.exerciseCatalog.delete({
    where: { name },
  });
}