import type {
  BodyWeightLog,
  CreateBodyWeightLogRequest,
} from "../Types/BodyWeight.type";

import { prisma } from "../Lib/prisma";

export async function getAllBodyWeightLogs(
  user_id: string,
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
      body_weight: logData.body_weight,
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
  body_weight: number,
  date: Date,
): Promise<boolean> {
  try {
    await prisma.bodyWeightLog.update({
      where: { id },
      data: {
        body_weight,
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
