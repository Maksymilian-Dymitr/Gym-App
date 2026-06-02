import type { FastifyReply, FastifyRequest } from "fastify";
import * as workoutService from "../../../Services/User/Workout.service";

import { getWorkoutByUserIdAndTitle } from "../../../repository/Workout.repository";

export async function getAllWorkouts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const result = await workoutService.getAllWorkoutSerivce(reply, (request.user as any).id);

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(200).send(result);
}

export async function createWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, set_ids, total_workout_volume } = request.body as {
    title: string;
    set_ids: string[];
    total_workout_volume: number;
  };

  const result = await workoutService.createWorkoutService(
    reply,
    (request.user as any).id,
    title,
    set_ids,
    total_workout_volume,
  );

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(201).send({
    newWorkout: result,
  });
}

export async function deleteWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title } = request.params as { title: string };

  await workoutService.deleteWorkoutService(reply, (request.user as any).id, title);

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(200).send({ message: "Workout deleted", title });
}

export async function updateWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, typeOfChange, changedData } = request.body as {
    title: string;
    typeOfChange: string;
    changedData: string | number;
  };

  await workoutService.updateWorkoutService(
    reply,
    (request.user as any).id,
    title,
    typeOfChange,
    changedData,
  );

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(200).send({ message: "Workout updated successfully" });
}

export async function getWorkout(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  console.log("Searching for workout with:", { user_id: (request.user as any).id, title: id });
  const result = await getWorkoutByUserIdAndTitle((request.user as any).id, id);

  if (!result) {
    console.log("Workout not found for:", { user_id: (request.user as any).id, title: id });
    return reply.status(404).send({ message: "No Workout Found" });
  }

  console.log("Workout found:", result);
  return reply.status(200).send(result);
}
