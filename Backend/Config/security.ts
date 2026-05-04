import { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

export async function setupSecure(app: FastifyInstance) {
  await app.register(fastifyHelmet);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  await app.register(cors, {
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
  });
}
