import bcrypt from "bcrypt";
import { findByEmail, create, updateUserField, deleteUserById, getAllUsers } from "../../repository/UserRepository";

export class AdminAuthService {
  static async updateUserPassword(userEmail: string, newPassword: string): Promise<void> {
    const user = await findByEmail(userEmail);
    if (!user) {
      throw new Error("User not found");
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await updateUserField("password", hashedPassword, userEmail);
  }

  static async updateUserRole(userEmail: string, newRole: string): Promise<void> {
    const user = await findByEmail(userEmail);
    if (!user) {
      throw new Error("User not found");
    }

    await updateUserField("role", newRole, userEmail);
  }

  static async createUser(email: string, password: string, role: string) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    return await create({
      email,
      password: hashedPassword,
      role
    });
  }

  static async deleteUser(userId: string): Promise<void> {
    await deleteUserById(userId);
  }
}
