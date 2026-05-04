import { type FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";

export async function setupDatabase(app: FastifyInstance) {
  await app.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });
  
}
