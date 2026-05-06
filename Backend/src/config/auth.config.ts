import { type FastifyInstance } from "fastify";

import fastifyJWT from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";

export async function setupAuth(app: FastifyInstance) {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error("JWT_SECRET_KEY is not defined in .env");

  await app.register(fastifyJWT, { secret: secret as string });
  await app.register(fastifyCookie);
}
