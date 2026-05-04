import type {FastifyReply, FastifyRequest } from "fastify";
import * as exerciseService from "../../../Services/User/Exercise";

export async function getExercise(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { exercise } = request.params as { exercise: string };
  const result = await exerciseService.getExerciseService(exercise, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}

export async function getAllExercises(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await exerciseService.getAllExercisesService(reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}

export async function createSet(request: FastifyRequest, reply: FastifyReply) {
  const { exercise_name, sets, reps, weight } = request.body as {
    exercise_name: string;
    sets: number;
    reps: number;
    weight: number;
  };

  const result = await exerciseService.createSetService(
    exercise_name,
    sets,
    reps,
    weight,
    reply,
    (request.user as any).id
  );
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(201).send({
    newExercise: result,
  });
}

export async function removeSet(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = await exerciseService.removeSetService(id, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return result;
}

export async function getAllSets(request: FastifyRequest, reply: FastifyReply) {
  const result = await exerciseService.getAllSetsService(reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}

export async function getSet(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const result = await exerciseService.getSetService(id, reply);
  
  if (reply.statusCode >= 400) {
    return;
  }
  
  return reply.status(200).send(result);
}
