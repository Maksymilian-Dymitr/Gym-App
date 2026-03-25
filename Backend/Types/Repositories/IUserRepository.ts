import { type FastifyRequest, type FastifyReply } from "fastify";

export interface IUser {
  id: string;
  email: string;
  password?: string;
  google_id?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  role: string;
  google_id?: string;
}

export interface IUserRepository {
  findByEmail(email: string, request: FastifyRequest): Promise<IUser | null>;
  findById(id: string, request: FastifyRequest): Promise<IUser | null>;
  findByGoogleId(googleId: string, request: FastifyRequest): Promise<IUser | null>;
  create(userData: ICreateUserRequest, request: FastifyRequest): Promise<IUser>;
  updateGoogleId(userId: string, googleId: string, request: FastifyRequest): Promise<void>;
  findByEmailOrGoogleId(email: string, googleId: string, request: FastifyRequest): Promise<IUser[]>;
}
