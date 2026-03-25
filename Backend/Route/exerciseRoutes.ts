import {
  type FastifyInstance,
  type FastifyPluginOptions,
} from "fastify";

import * as exerciseCtrls from "../Controllers/Gym/User/Exercise";
import * as gymSchema from "../Schema/Gym";
import { verifyUser } from "../Middleware/auth";

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
    "/exercise/:exerciseId",
    {
      schema: { response: { 200: gymSchema.ExerciseCatalogSchema } },
      preHandler: authenticate,
    },
    exerciseCtrls.getExercise,
  );

  server.post("/sets", { preHandler: authenticate }, exerciseCtrls.createSet);
  server.delete("/sets/:id", { preHandler: authenticate }, exerciseCtrls.removeSet);
  server.get("/sets", { preHandler: authenticate }, exerciseCtrls.getAllSets);
  server.get("/sets/:setId", { preHandler: authenticate }, exerciseCtrls.getSet);
}

export default exerciseRoutes;
