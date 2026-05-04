import type { FastifyInstance, FastifyPluginOptions } from "fastify";

import * as bodyWeightCtrls from "../Controllers/Gym/User/BodyWeightLogs";
import { verifyUser } from "../middleware/auth";

async function bodyweightRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const authenticate = (request: any, reply: any) =>
    verifyUser(request, reply);

  server.get(
    "/bodyweight",
    { preHandler: authenticate },
    bodyWeightCtrls.getAllBodyWeightLogs,
  );

  server.post(
    "/bodyweight",
    { preHandler: authenticate },
    bodyWeightCtrls.createBodyWeightLog,
  );

  server.get(
    "/bodyweight/:id",
    { preHandler: authenticate },
    bodyWeightCtrls.getBodyWeightLog,
  );

  server.put(
    "/bodyweight/:id",
    { preHandler: authenticate },
    bodyWeightCtrls.updateBodyWeightLog,
  );

  server.delete(
    "/bodyweight/:id",
    { preHandler: authenticate },
    bodyWeightCtrls.deleteBodyWeightLog,
  );
}

export default bodyweightRoutes;
