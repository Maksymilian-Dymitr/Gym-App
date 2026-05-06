import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as exerciseCtrls from "../Controllers/Gym/User/Exercise.user.controller";
import * as gymSchema from "../schema/Gym.schema";
import { verifyUser } from "../middleware/auth.middleware";

async function exerciseRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const authenticate = (request: any, reply: any) =>
    verifyUser(request, reply);

  server.get(
    "/exercises",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: gymSchema.ExerciseCatalogSchema,
          },
        },
      },
      preHandler: authenticate,
    },
    exerciseCtrls.getAllExercises,
  );

  server.get(
    "/exercise/:exercise",
    {
      schema: { response: { 200: gymSchema.ExerciseCatalogSchema } },
      preHandler: authenticate,
    },
    exerciseCtrls.getExercise,
  );

  server.post("/sets", { preHandler: authenticate }, exerciseCtrls.createSet);
  server.delete("/sets/:id", { preHandler: authenticate }, exerciseCtrls.removeSet);
  server.get("/sets", { preHandler: authenticate }, exerciseCtrls.getAllSets);
  server.get("/sets/:id", { preHandler: authenticate }, exerciseCtrls.getSet);
}

export default exerciseRoutes;
