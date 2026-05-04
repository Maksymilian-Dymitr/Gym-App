import { createExercise, deleteExerciseByName } from "../../repository/ExerciseRepository";

export class ExerciseService {
  static async createExercise(name: string, equipment: string[], muscleGroups: string[]) {
    if (!name?.trim()) {
      throw new Error("Name is required");
    }

    if (!equipment?.length) {
      throw new Error("Equipment required");
    }

    if (!muscleGroups?.length) {
      throw new Error("Muscle groups required");
    }

    return createExercise({ name, equipment, muscleGroups });
  }

  static async deleteExercise(name: string) {
    if (!name || name.trim() === "") {
      throw new Error("Exercise name is required");
    }

    try {
      return await deleteExerciseByName(name);
    } catch (err: any) {
      if (err.code === "P2025") {
        throw new Error("Exercise not found");
      }
      throw err;
    }
  }
}
