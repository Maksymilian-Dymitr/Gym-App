import type { FastifyReply } from "fastify";
import {
  getAllWorkoutsByUserId,
  createWorkout,
  deleteWorkout,
  updateWorkout,
} from "../../repository/Workout.repository";

export async function getAllWorkoutSerivce(
  reply: FastifyReply,
  user_id: string,
) {
  const result = await getAllWorkoutsByUserId(user_id);

  if (result.length === 0) {
    return reply.status(404).send({ error: "No workouts found" });
  }

  return result;
}

export async function createWorkoutService(
  reply: FastifyReply,
  user_id: string,
  title: string,
  set_ids: string[],
  total_workout_volume: number,
) {
  if (!title || title.trim() === "") {
    return reply.status(400).send({ error: "Title is required" });
  }
  if (!set_ids || !Array.isArray(set_ids) || set_ids.length === 0) {
    return reply.status(400).send({ error: "At least one set is required" });
  }

  const result = await createWorkout({
    title,
    creator_id: user_id,
    user_id,
    date: new Date(),
    total_workout_volume,
    set_ids,
  });

  return result;
}

export async function deleteWorkoutService(
  reply: FastifyReply,
  user_id: string,
  title: string,
) {
  if (!title || title === "")
    return reply.status(400).send({ error: "Workout title is required" });

  const result = await deleteWorkout(user_id, title);
  if (!result) return reply.status(404).send({ error: "Workout not found" });
}

export async function updateWorkoutService(
  reply: FastifyReply,
  user_id: string,
  title: string,
  typeOfChange: string,
  changedData: string | number,
) {
  const result = await updateWorkout(user_id, title, typeOfChange, changedData);

  if (!result) {
    reply.status(404).send({ message: "No Workout Found" });
  }
}
