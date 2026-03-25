import { type FastifyReply, type FastifyRequest } from "fastify";

export function setupErrorHandlers(app: any) {
  app.setErrorHandler(
    (error: any, request: FastifyRequest, reply: FastifyReply) => {
      if (error.validation) {
        return reply.status(400).send({
          error: "Validation Failed",
          details: error.validation,
        });
      }
      if (error.code === "23505" || error.code === "11000") {
        return reply.status(400).send({
          error: "Conflict",
          message: "This data already exists"
        })
      }
      if (error.name === "CastError"){
        return reply.status(400).send({
          error: "Invalid ID",
          message: `The Provided ID is Incorrect: ${error.path}`
        })
      }
      if (error.statusCode && error.statusCode < 500) {
        return reply.status(error.statusCode).send({ 
          error: error.name,
          message: error.message });
      }
      console.log(error);
      reply.status(500).send({
        error: "Internal Server Error",
        message: "Something Went Wrong" });
    },
  );

  app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    console.log(`Route has not been found: ${request.method}:${request.url}`);
    reply.status(404).send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} does not exist`,
    });
  });
}
