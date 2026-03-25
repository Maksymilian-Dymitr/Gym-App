import fastify, {
  type FastifyInstance,
} from "fastify";
import cors from "@fastify/cors";
import fastifyPostgres from "@fastify/postgres";
import fastifyHelmet from "@fastify/helmet";
import fastifyJWT from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";

export async function createApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });
  const secret = process.env.JWT_SECRET_KEY
  if (!secret) throw new Error("JWT_SECRET_KEY is not defined in .env")

  await app.register(fastifyHelmet);
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
  await app.register(cors, {
    origin: ["http://localhost:3001", "http://localhost:3000", "http://localhost:3002"]
  });
  await app.register(fastifyJWT, {secret: secret as string});
  await app.register(fastifyCookie);

  return app;
}
