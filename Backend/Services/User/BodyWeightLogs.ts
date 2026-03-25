import { type FastifyReply } from "fastify";
import { getAllBodyWeightLogs, createBodyWeightLog, getBodyWeightLogById, updateBodyWeightLog, deleteBodyWeightLog } from "../../Repositories/BodyWeightRepository";


export async function getAllBodyWeightLogsService(
  user_id: number,
  reply: FastifyReply
) {
  const result = await getAllBodyWeightLogs(user_id);
  return result;
}

export async function createBodyWeightLogService(
  user_id: number,
  weight: number,
  date: Date,
  reply: FastifyReply
) {
  if (!weight || weight <= 0) {
    return reply.status(400).send({ error: "Valid weight is required" });
  }

  if (!date) {
    return reply.status(400).send({ error: "Date is required" });
  }

  const result = await createBodyWeightLog({
    user_id,
    weight,
    date
  });
  
  return result;
}

export async function getBodyWeightLogService(
  id: string,
  reply: FastifyReply
) {
  const result = await getBodyWeightLogById(id);
  
  if (!result) {
    return reply.status(404).send({ error: "Body weight log not found" });
  }
  
  return result;
}

export async function updateBodyWeightLogService(
  id: string,
  weight: number,
  date: Date,
  reply: FastifyReply
) {
  if (!weight || weight <= 0) {
    return reply.status(400).send({ error: "Valid weight is required" });
  }

  if (!date) {
    return reply.status(400).send({ error: "Date is required" });
  }

  const result = await updateBodyWeightLog(id, weight, date);
  
  if (!result) {
    return reply.status(404).send({ error: "Body weight log not found" });
  }
  
  return reply.status(200).send({ message: "Body weight log updated successfully" });
}

export async function deleteBodyWeightLogService(
  id: string,
  reply: FastifyReply
) {
  const result = await deleteBodyWeightLog(id);
  
  if (!result) {
    return reply.status(404).send({ error: "Body weight log not found" });
  }
  
  return reply.status(200).send({ message: "Body weight log deleted successfully" });
}