import { type FastifyReply, type FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { findByEmail, create } from "../../Repositories/UserRepository";


export async function updateInsert(
  type: string,
  changedData: string,
  userEmail: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allowedTypes = ["password", "role"];

  if (!allowedTypes.includes(type)) {
    return reply.status(400).send({ message: "Invalid Type" });
  }

  const user = await findByEmail(userEmail, request);
  if (!user) {
    return reply.status(404).send({ message: "User not found" });
  }

  let hashedPassword = changedData;
  if (type === "password") {
    const salt: number = 10;
    hashedPassword = await bcrypt.hash(changedData, salt);
  }

  const query: string = `UPDATE users SET ${type} = $1 WHERE email = $2`;
  await request.server.pg.query(query, [hashedPassword, userEmail]);
}

export async function createUser(
  email: string,
  password: string,
  role: string,
  request: FastifyRequest,
) {
  const salt: number = 10;
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const result = await create({
    email,
    password: hashedPassword,
    role
  }, request);
  
  return { rows: [result] };
}

export async function deleteAccount(
  userId: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteQuery = `DELETE FROM users WHERE id = $1`;
  await request.server.pg.query(deleteQuery, [userId]);

  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });
}
