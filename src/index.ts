import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 3000,
  routes: {
    "/": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },
  },
});

console.log(`Listening on http://localhost:${server.port}`);