import { setupErrorHandlers } from "./config/errorHandler.config";
import fastify from "fastify";
import routes from "./routes/routes";

async function start() {
  const app = fastify({ logger: true });


  await app.register(routes);
  
  setupErrorHandlers(app);

  app.listen({ port: Number(process.env.PORT) || 3001, host: "0.0.0.0" }, (address) =>
    console.log(`Server is running at ${address}`),
  );
}

start();
