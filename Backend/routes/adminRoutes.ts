import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import * as exerciseAdminCtrls from "../Controllers/Gym/Admin/Exercise";
import * as authAdmin from "../Controllers/Auth/admin";
import { verifyUser } from "../middleware/auth";

async function adminRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const adminAuth = (request: any, reply: any) =>
    verifyUser(request, reply, true);

  server.post(
    "/exercise",
    { preHandler: adminAuth },
    exerciseAdminCtrls.createExerciseHandler,
  );
  server.delete(
    "/exercises/:name",
    { preHandler: adminAuth },
    exerciseAdminCtrls.deleteExerciseHandler,
  );

  server.post("/user/create", { preHandler: adminAuth }, authAdmin.createAdmin);
  server.delete(
    "/user/:email",
    { preHandler: adminAuth },
    authAdmin.deleteAccount,
  );
  server.get("/user", { preHandler: adminAuth }, authAdmin.showAllUsers);
  server.post("/user/update", { preHandler: adminAuth }, authAdmin.updateUser);
}

export default adminRoutes;
