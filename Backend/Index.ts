import { createApp } from "./Config/app";
import { setupErrorHandlers } from "./Config/errorHandlers";
import { setupDatabase } from "./Config/database";
import { startServer } from "./Config/server";
import routes from "./Route/routes";

async function start() {
  const app = await createApp();
  
  setupErrorHandlers(app);
  
  await setupDatabase(app);
  
  await app.register(routes);
  
  await startServer(app);
}

start();
