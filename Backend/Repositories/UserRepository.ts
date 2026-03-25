import { type FastifyRequest } from "fastify";
import type { IUserRepository, IUser, ICreateUserRequest } from "../Types/Repositories/IUserRepository";

export async function findByEmail(email: string, request: FastifyRequest): Promise<IUser | null> {
  const userQuery = `SELECT * FROM users WHERE email = $1`;
  const result = await request.server.pg.query(userQuery, [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function findById(id: string, request: FastifyRequest): Promise<IUser | null> {
  const userQuery = `SELECT * FROM users WHERE id = $1`;
  const result = await request.server.pg.query(userQuery, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function findByGoogleId(googleId: string, request: FastifyRequest): Promise<IUser | null> {
  const userQuery = `SELECT * FROM users WHERE google_id = $1`;
  const result = await request.server.pg.query(userQuery, [googleId]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function create(userData: ICreateUserRequest, request: FastifyRequest): Promise<IUser> {
  const insertQuery = `INSERT INTO users (email, password, role, google_id) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await request.server.pg.query(insertQuery, [
    userData.email,
    userData.password,
    userData.role,
    userData.google_id || null
  ]);
  return result.rows[0];
}

export async function updateGoogleId(userId: string, googleId: string, request: FastifyRequest): Promise<void> {
  const updateQuery = `UPDATE users SET google_id = $1 WHERE id = $2`;
  await request.server.pg.query(updateQuery, [googleId, userId]);
}

export async function findByEmailOrGoogleId(email: string, googleId: string, request: FastifyRequest): Promise<IUser[]> {
  const userQuery = `SELECT * FROM users WHERE email = $1 OR google_id = $2`;
  const result = await request.server.pg.query(userQuery, [email, googleId]);
  return result.rows;
}
