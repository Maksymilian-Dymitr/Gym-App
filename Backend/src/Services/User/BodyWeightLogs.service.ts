import { type FastifyReply } from "fastify";
import { getAllBodyWeightLogs, createBodyWeightLog, getBodyWeightLogById, updateBodyWeightLog, deleteBodyWeightLog } from "../../repository/BodyWeight.repository";


export async function getAllBodyWeightLogsService(
  user_id: string,
  reply: FastifyReply
) {
  const result = await getAllBodyWeightLogs(user_id);
  return result;
}

export async function createBodyWeightLogService(
  user_id: string,
  body_weight: number,
  date: Date,
  reply: FastifyReply
) {
  if (!body_weight || body_weight <= 0) {
    return reply.status(400).send({ error: "Valid body_weight is required" });
  }

  if (!date) {
    return reply.status(400).send({ error: "Date is required" });
  }

  const result = await createBodyWeightLog({
    user_id,
    body_weight,
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
  body_weight: number,
  date: Date,
  reply: FastifyReply
) {
  if (!body_weight || body_weight <= 0) {
    return reply.status(400).send({ error: "Valid body_weight is required" });
  }

  if (!date) {
    return reply.status(400).send({ error: "Date is required" });
  }

  const result = await updateBodyWeightLog(id, body_weight, date);
  
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