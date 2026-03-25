import { type FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";
import { connectMongo } from "../DB/mongo";

export async function setupDatabase(app: FastifyInstance) {
  await app.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_URI,
  });
  
  await app.register(connectMongo);
}
