import type { FastifyReply } from "fastify";
import { getAllWorkoutsByUserId, createWorkout, deleteWorkout, updateWorkout } from "../../repository/WorkoutRepository";


export async function getAllWorkoutSerivce(
  reply: FastifyReply,
  user_id: number,
) {
  const result = await getAllWorkoutsByUserId(user_id);

  if (result.length === 0) {
    return reply.status(404).send({ error: "No workouts found" });
  }

  return result;
}

export async function createWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
  exercise_list: any[],
  total_workout_volume: number,
) {
  if (!title || title.trim() === "") {
    reply.status(400).send({ error: "Title is required" });
    throw new Error("Title is required")
  }
  if (
    exercise_list.length === 0 ||
    !exercise_list ||
    !Array.isArray(exercise_list)
  ) {
    return reply
      .status(400)
      .send({ error: "At Least One Exercise is Required" });
  }

  const newWorkout = {
    title,
    creator_id: user_id,
    exercise_list,
    total_workout_volume,
  };
  
  const result = await createWorkout(newWorkout);
  return result;
}

export async function deleteWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
) {
  if (!title || title === "")
    return reply.status(401).send({ error: "Workout title is required" });

  const result = await deleteWorkout(user_id, title);
  if (!result)
    return reply.status(404).send({ error: "Workout not found" });
}

export async function updateWorkoutService(
  reply: FastifyReply,
  user_id: number,
  title: string,
  typeOfChange: string ,
  changedData: string | number,
  ) {
  const result = await updateWorkout(user_id, title, typeOfChange, changedData);
 
  if (!result) {
    reply.status(404).send({ message: "No Workout Found" });
  }
}