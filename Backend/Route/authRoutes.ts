import {
  type FastifyInstance,
  type FastifyPluginOptions,
} from "fastify";
import * as auth from "../Controllers/Auth/auth";
import { refreshToken } from "../Services/User/auth";
import { verifyUser } from "../Middleware/auth";

async function authRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions,
) {
  const authenticate = (request: any, reply: any) =>
    verifyUser(request, reply);

  server.post("/auth/signin", auth.signin);
  server.post("/auth/login", auth.login);
  server.post("/auth/signout", auth.signout);
  server.get("/login/google/callback", auth.googleCallback);
  server.post("/auth/refresh", refreshToken);
  
  server.get("/login/google", async (request, reply) => {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientID || !clientSecret) {
      console.error("Missing Google OAuth credentials:", {
        GOOGLE_CLIENT_ID: !clientID,
        GOOGLE_CLIENT_SECRET: !clientSecret
      });
      return reply.status(500).send({ error: "Google OAuth not configured properly" });
    }
    
    const redirectUri = "http://localhost:3002/login/google/callback";
    const scope = "profile email";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    console.log("Google OAuth URL generated:", authUrl);
    return reply.redirect(authUrl);
  });
}

export default authRoutes;
