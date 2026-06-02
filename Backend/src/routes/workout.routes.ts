import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as workoutCtrls from "../Controllers/Gym/User/Workout.controller";
import { verifyUser } from "../middleware/auth.middleware";

async function workoutRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const authenticate = (request: any, reply: any) =>
    verifyUser(request, reply);

  server.post("/workout", { preHandler: authenticate }, workoutCtrls.createWorkout);
  server.put("/workout/:id", { preHandler: authenticate }, workoutCtrls.updateWorkout);
  server.get("/workout/:id", { preHandler: authenticate }, workoutCtrls.getWorkout);
  server.get("/workouts", { preHandler: authenticate }, workoutCtrls.getAllWorkouts);
  server.delete(
    "/workouts/:title",
    { preHandler: authenticate },
    workoutCtrls.deleteWorkout,
  );
}

export default workoutRoutes;
