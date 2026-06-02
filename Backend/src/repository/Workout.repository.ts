import type { WorkoutCatalog } from "../Types/gym.type";
import type { CreateWorkoutRequest } from "../Types/Workout.type";

import { prisma } from "../Lib/prisma";

export async function getAllWorkoutsByUserId(
  user_id: string,
): Promise<WorkoutCatalog[]> {
  return prisma.workout.findMany({
    where: { creator_id: user_id },
    include: { sets: true },
  });
}

export async function createWorkout(
  workoutData: CreateWorkoutRequest,
): Promise<WorkoutCatalog> {
  const { set_ids, ...data } = workoutData;

  return prisma.$transaction(async (tx) => {
    const workout = await tx.workout.create({
      data,
      include: { sets: true },
    });

    if (set_ids.length > 0) {
      await tx.set.updateMany({
        where: { id: { in: set_ids }, user_id: data.user_id },
        data: { workout_id: workout.id },
      });
    }

    return workout;
  });
}

export async function deleteWorkout(
  user_id: string,
  title: string,
): Promise<boolean> {
  const result = await prisma.workout.deleteMany({
    where: { creator_id: user_id, title },
  });

  return result.count > 0;
}

export async function updateWorkout(
  user_id: string,
  title: string,
  updateField: string,
  updateValue: any,
): Promise<boolean> {
  try {
    await prisma.workout.updateMany({
      where: { creator_id: user_id, title },
      data: { [updateField]: updateValue },
    });

    return true;
  } catch {
    return false;
  }
}

export async function getWorkoutByUserIdAndTitle(
  user_id: string,
  title: string,
): Promise<WorkoutCatalog | null> {
  return prisma.workout.findFirst({
    where: { creator_id: user_id, title },
    include: { sets: true },
  });
}
