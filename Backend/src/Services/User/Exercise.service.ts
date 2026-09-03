import type { FastifyReply } from "fastify";
import { getExerciseByName, getAllExercises, createSet, getSetById, getAllSets, removeSet } from "../../repository/Exercise.repository";
import type { CreateSetRequest } from "../../Types/Exercise.type";

export async function getExerciseService(
  exercise: string,
  reply: FastifyReply,
) {
  if (!exercise || exercise === "") {
    return reply.status(400).send({ error: "Invalid Exercise" });
  }

  const result = await getExerciseByName(exercise);

  if (!result) {
    return reply.status(404).send({ error: "Exercise not found" });
  }

  return result;
}

export async function getAllExercisesService(reply: FastifyReply) {
  const result = await getAllExercises();
  return result;
}

export async function createSetService(
  exercise_name: string,
  sets: number,
  reps: number,
  weight: number,
  reply: FastifyReply,
  user_id:string
) {
  if (!reps || reps === 0)
    return reply.status(400).send({ error: "Reps are required" });
  if (reps >= 30)
    return reply.status(400).send({ error: "No more than 30 reps" });

  if (!sets || sets === 0) {
    return reply.status(400).send({ error: "Sets are required" });
  }
  if (sets >= 10)
    return reply.status(400).send({ error: "No more than 10 sets" });

  if (!exercise_name || exercise_name.trim() === "") {
    return reply.status(400).send({ error: "Exercise is required" });
  }

  const result = await createSet({
    exercise_name,
    sets,
    reps,
    weight,
    user_id
  });
  return result;
}

export async function getSetService(
  id: string,
  reply: FastifyReply
) {
  const result = await getSetById(id);
  
  if (!result) {
    return reply.status(404).send({ error: "Set not found" });
  }
  
  return result;
}

export async function getAllSetsService(reply: FastifyReply, user_id: string) {
  const result = await getAllSets(user_id);
  return result;
}

export async function removeSetService(
  id: string,
  reply: FastifyReply
) {
  const result = await removeSet(id);
  
  if (!result) {
    return reply.status(404).send({ error: "Set not found" });
  }
  
  return reply.status(200).send({ message: "Set removed successfully" });
}