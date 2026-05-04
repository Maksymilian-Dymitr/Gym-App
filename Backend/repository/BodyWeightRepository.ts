import type {
  BodyWeightLog,
  CreateBodyWeightLogRequest,
} from "../Types/Repositories/BodyWeightRepository";

import { prisma } from "../Lib/prisma";

export async function getAllBodyWeightLogs(
  user_id: number,
): Promise<BodyWeightLog[]> {
  return prisma.bodyWeightLog.findMany({
    where: {
      user_id,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function createBodyWeightLog(
  logData: CreateBodyWeightLogRequest,
): Promise<BodyWeightLog> {
  return prisma.bodyWeightLog.create({
    data: {
      user_id: logData.user_id,
      weight: logData.weight,
      date: logData.date,
    },
  });
}

export async function getBodyWeightLogById(
  id: string,
): Promise<BodyWeightLog | null> {
  return prisma.bodyWeightLog.findUnique({
    where: { id },
  });
}

export async function updateBodyWeightLog(
  id: string,
  weight: number,
  date: Date,
): Promise<boolean> {
  try {
    await prisma.bodyWeightLog.update({
      where: { id },
      data: {
        weight,
        date,
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function deleteBodyWeightLog(id: string): Promise<boolean> {
  try {
    await prisma.bodyWeightLog.delete({
      where: { id },
    });

    return true;
  } catch {
    return false;
  }
}
