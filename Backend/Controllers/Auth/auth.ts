import { type FastifyReply, type FastifyRequest } from "fastify";
import * as authServices from "../../Services/User/auth";
import * as adminAuthServices from "../../Services/Admin/auth";


export async function signin(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const result = await adminAuthServices.createUser(
    email,
    password,
    "User",
    request,
  );

  reply.status(201).send({
    message: "New User has been Created",
    user: result.rows[0],
  });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };
  const user = await authServices.loginUser(email, password, request, reply);
  
  if (reply.statusCode >= 400 || !user) {
    console.log("Login failed, statusCode:", reply.statusCode);
    return; 
  }
  
  console.log("Generating tokens for user:", user.id, user.role);
  const token = await authServices.generateToken(user.id, user.role, reply);
  
  console.log("Tokens generated:", token);
  const response = { message: "Login Succsessful", ...token, user: { id: user.id, email: user.email, role: user.role } };
  console.log("Sending response:", response);
  
  reply.status(200).send(response);
}

export async function signout(request: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });
  return reply.status(200).send({ message: "Logout Succsessful" });
}

export async function googleCallback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { code } = request.query as { code: string };
  
  if (!code) {
    return reply.status(400).send({ error: "Authorization code not provided" });
  }

  const { user, email } = await authServices.googleOAuthService(code, request);
  const tokens = await authServices.generateToken(user.id, user.role, reply);

  return reply.redirect(
    `http://localhost:3001/login-success?token=${tokens.accessToken}&userId=${user.id}&role=${user.role}&email=${email}`
  );
}
