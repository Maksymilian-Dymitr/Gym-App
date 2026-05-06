import { type FastifyRequest, type FastifyReply } from "fastify";
import { type User as PrismaUser, Role } from "@prisma/client";

export type User = PrismaUser;

export interface CreateUserRequest {
  email: string;
  password: string;
  role: Role;
  google_id?: string | null;
}

export interface UserRepository {
  findByEmail(email: string, request: FastifyRequest): Promise<User | null>;
  findById(id: string, request: FastifyRequest): Promise<User | null>;
  findByGoogleId(googleId: string, request: FastifyRequest): Promise<User | null>;
  create(userData: CreateUserRequest, request: FastifyRequest): Promise<User>;
  updateGoogleId(userId: string, googleId: string, request: FastifyRequest): Promise<void>;
  findByEmailOrGoogleId(email: string, googleId: string, request: FastifyRequest): Promise<User[]>;
}

