import type { FastifyReply, FastifyRequest } from "fastify";
import type { Equipments, MuscleGroups } from "../../../Types/gym.type";
import { ExerciseService } from "../../../Services/Admin/Exercise.service";

export async function createExerciseHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { name, equipment, muscleGroups } = request.body as {
      name: string;
      equipment: Equipments;
      muscleGroups: MuscleGroups;
    };

    const result = await ExerciseService.createExercise(
      name,
      equipment,
      muscleGroups,
    );

    return reply.status(201).send({
      message: "Exercise created successfully",
      exercise: result,
    });
  } catch (error: any) {
    return reply.status(400).send({ 
      message: "Failed to create exercise", 
      error: error?.message || "Unknown error" 
    });
  }
}

export async function deleteExerciseHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { name } = request.params as { name: string };

    await ExerciseService.deleteExercise(name);

    return reply.status(200).send({
      message: "Exercise deleted successfully",
    });
  } catch (error: any) {
    if (error?.message === "Exercise not found") {
      return reply.status(404).send({ message: "Exercise not found" });
    } else if (error?.message === "Exercise name is required") {
      return reply.status(400).send({ message: "Exercise name is required" });
    } else {
      return reply.status(500).send({ 
        message: "Failed to delete exercise", 
        error: error?.message || "Unknown error" 
      });
    }
  }
}
