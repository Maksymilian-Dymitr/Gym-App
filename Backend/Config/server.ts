import { type FastifyInstance } from "fastify";

export async function startServer(app: FastifyInstance) {
  app.listen({ port: 3002, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
}
