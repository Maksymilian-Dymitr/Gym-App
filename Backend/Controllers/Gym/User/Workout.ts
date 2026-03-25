import { type FastifyReply, type FastifyRequest } from "fastify";
import { type Sets } from "../../../Types/gym";
import * as workoutService from "../../../Services/User/Workout";
import { getWorkoutByUserIdAndTitle } from "../../../Repositories/WorkoutRepository";


export async function getAllWorkouts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = await request.jwtVerify<{ id: number }>();
  const result = await workoutService.getAllWorkoutSerivce(reply, decoded.id);

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(200).send(result);
}

export async function createWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, exercise_list, total_workout_volume } = request.body as {
    title: string;
    exercise_list: Sets[];
    total_workout_volume: number;
  };

  const decoded = await request.jwtVerify<{ id: number }>();

  const result = await workoutService.createWorkoutService(
    reply,
    decoded.id,
    title,
    exercise_list,
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
  const decoded = await request.jwtVerify<{ id: number }>();
  const { title } = request.params as { title: string };

  await workoutService.deleteWorkoutService(reply, decoded.id, title);

  if (reply.statusCode >= 400) {
    return;
  }

  return reply.status(200).send({ message: "Workout deleted", title });
}

export async function updateWorkout(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const decoded = await request.jwtVerify<{ id: number }>();

  const { title, typeOfChange, changedData } = request.body as {
    title: string;
    typeOfChange: string;
    changedData: string | number;
  };

  workoutService.updateWorkoutService(
    reply,
    decoded.id,
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
  const decoded = await request.jwtVerify<{ id: number }>();
  const { title } = request.params as { title: string };

  const result = await getWorkoutByUserIdAndTitle(decoded.id, title);

  if (!result) {
    return reply.status(404).send({ message: "No Workout Found" });
  }

  return reply.status(200).send(result);
}
