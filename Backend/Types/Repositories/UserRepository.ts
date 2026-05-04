import { type FastifyRequest, type FastifyReply } from "fastify";

export interface User {
  id: string;
  email: string;
  password?: string;
  google_id?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  google_id?: string;
}

export interface UserRepository {
  findByEmail(email: string, request: FastifyRequest): Promise<User | null>;
  findById(id: string, request: FastifyRequest): Promise<User | null>;
  findByGoogleId(googleId: string, request: FastifyRequest): Promise<User | null>;
  create(userData: CreateUserRequest, request: FastifyRequest): Promise<User>;
  updateGoogleId(userId: string, googleId: string, request: FastifyRequest): Promise<void>;
  findByEmailOrGoogleId(email: string, googleId: string, request: FastifyRequest): Promise<User[]>;
}
