import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import authRoutes from "./authRoutes";
import exerciseRoutes from "./exerciseRoutes";
import workoutRoutes from "./workoutRoutes";
import adminRoutes from "./adminRoutes";
import bodyweightRoutes from "./bodyweightRoutes";

async function routes(server: FastifyInstance, options: FastifyPluginOptions) {
  await server.register(authRoutes);
  await server.register(exerciseRoutes);
  await server.register(workoutRoutes);
  await server.register(adminRoutes);
  await server.register(bodyweightRoutes);
}

export default routes;
