import type { User, CreateUserRequest } from "../Types/Repositories/UserRepository";
import { prisma } from "../Lib/prisma";

export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findByGoogleId(
  googleId: string
): Promise<User | null> {
  return prisma.user.findFirst({
    where: { google_id: googleId },
  });
}

export async function create(userData: CreateUserRequest): Promise<User> {
  return prisma.user.create({
    data: {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      google_id: userData.google_id ?? null,
    },
  });
}

export async function updateGoogleId(
  userId: string,
  googleId: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { google_id: googleId },
  });
}

export async function findByEmailOrGoogleId(
  email: string,
  googleId: string
): Promise<User[]> {
  return prisma.user.findMany({
    where: {
      OR: [
        { email },
        { google_id: googleId },
      ],
    },
  });
}

export async function updateUserField(field: string, value: string, userEmail: string): Promise<void> {
  const updateData: any = {};
  updateData[field] = value;
  
  await prisma.user.update({
    where: { email: userEmail },
    data: updateData,
  });
}

export async function deleteUserById(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany();
}
