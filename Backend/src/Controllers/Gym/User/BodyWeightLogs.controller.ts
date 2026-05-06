import type { FastifyReply, FastifyRequest } from "fastify";
import * as bodyWeightService from "../../../Services/User/BodyWeightLogs.service";

export async function getAllBodyWeightLogs(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await bodyWeightService.getAllBodyWeightLogsService((request.user as any).id, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}

export async function createBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { body_weight, date } = request.body as {
    body_weight: number;
    date: Date;
  };

  const result = await bodyWeightService.createBodyWeightLogService(
    (request.user as any).id,
    body_weight,
    date,
    reply
  );
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(201).send(result);
}

export async function getBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const result = await bodyWeightService.getBodyWeightLogService(id, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}

export async function updateBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { body_weight, date } = request.body as {
    body_weight: number;
    date: Date;
  };

  const result = await bodyWeightService.updateBodyWeightLogService(
    id,
    body_weight,
    date,
    reply
  );
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return result;
}

export async function deleteBodyWeightLog(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const result = await bodyWeightService.deleteBodyWeightLogService(id, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return result;
}
