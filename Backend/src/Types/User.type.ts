import { type User as PrismaUser, Role } from "@prisma/client";

export type User = PrismaUser;

export interface CreateUserRequest {
  email: string;
  password: string;
  role: Role;
  google_id?: string | null;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(userData: CreateUserRequest): Promise<User>;
  updateGoogleId(userId: string, googleId: string): Promise<void>;
  findByEmailOrGoogleId(email: string, googleId: string): Promise<User[]>;
}

