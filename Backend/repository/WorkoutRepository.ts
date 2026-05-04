import type { WorkoutCatalog } from "../Types/gym";
import type { CreateWorkoutRequest } from "../Types/Repositories/WorkoutRepository";

import { prisma } from "../Lib/prisma";

export async function getAllWorkoutsByUserId(
  user_id: number
): Promise<WorkoutCatalog[]> {
  return prisma.workout.findMany({
    where: {
      creator_id: user_id,
    },
  });
}

export async function createWorkout(
  workoutData: CreateWorkoutRequest
): Promise<WorkoutCatalog> {
  return prisma.workout.create({
    data: workoutData,
  });
}

export async function deleteWorkout(
  user_id: number,
  title: string
): Promise<boolean> {
  const result = await prisma.workout.deleteMany({
    where: {
      creator_id: user_id,
      title,
    },
  });

  return result.count > 0;
}

export async function updateWorkout(
  user_id: number,
  title: string,
  updateField: string,
  updateValue: any
): Promise<boolean> {
  try {
    await prisma.workout.updateMany({
      where: {
        creator_id: user_id,
        title,
      },
      data: {
        [updateField]: updateValue,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function getWorkoutByUserIdAndTitle(
  user_id: number,
  title: string
): Promise<WorkoutCatalog | null> {
  return prisma.workout.findFirst({
    where: {
      creator_id: user_id,
      title,
    },
  });
}