import {
  type FastifyInstance,
  type FastifyPluginOptions,
} from "fastify";

import * as exerciseAdminCtrls from "../Controllers/Gym/Admin/Exercise";
import * as authAdmin from "../Controllers/Auth/admin";
import { verifyUser } from "../Middleware/auth";

async function adminRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const adminAuth = (request: any, reply: any) =>
    verifyUser(request, reply, true);

  server.post(
    "/exercise",
    { preHandler: adminAuth },
    exerciseAdminCtrls.createExerciseToCatalog,
  );
  server.delete(
    "/exercises/:id",
    { preHandler: adminAuth },
    exerciseAdminCtrls.deleteExerciseFromCatalog,
  );

  server.post("/user/", { preHandler: adminAuth }, authAdmin.createAdmin);
  server.delete(
    "/user/:id",
    { preHandler: adminAuth },
    authAdmin.deleteAccount,
  );
  server.get("/user", { preHandler: adminAuth }, authAdmin.showAllUsers);
  server.post("/user", { preHandler: adminAuth }, authAdmin.updateAcount);
}

export default adminRoutes;
