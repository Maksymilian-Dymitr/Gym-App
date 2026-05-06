import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authRoutes from "./auth.routes";
import exerciseRoutes from "./exercise.routes";
import workoutRoutes from "./workout.routes";
import adminRoutes from "./admin.routes";
import bodyweightRoutes from "./bodyweight.routes";

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  await server.register(authRoutes);
  await server.register(exerciseRoutes);
  await server.register(workoutRoutes);
  await server.register(adminRoutes);
  await server.register(bodyweightRoutes);
}

export default routes;
