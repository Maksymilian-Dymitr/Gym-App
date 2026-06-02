import { type FastifyReply, type FastifyRequest } from "fastify";
import { AdminAuthService } from "../../Services/Admin/Auth.admin.service";
import { getAllUsers } from "../../repository/User.repository";

export async function createAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { newUserEmail, newUserPassword } = request.body as {
      newUserEmail: string;
      newUserPassword: string;
    };

    const result = await AdminAuthService.createUser(
      newUserEmail,
      newUserPassword,
      "Admin",
    );

    reply.status(201).send({
      message: "New Admin User has been Created",
      user: result,
    });
  } catch (error: any) {
    reply.status(500).send({ message: "Failed to create admin", error: error?.message || "Unknown error" });
  }
}

export async function updateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { userEmail, typeOfChange, changedData } = request.body as {
      userEmail: string;
      typeOfChange: string;
      changedData: string;
    };

    const type = typeOfChange.toLowerCase();

    if (type === "password") {
      await AdminAuthService.updateUserPassword(userEmail, changedData);
      reply.status(201).send({
        message: "Password has been updated",
      });
    } else if (type === "role") {
      await AdminAuthService.updateUserRole(userEmail, changedData);
      reply.status(201).send({
        message: `Admin has changed ${userEmail}'s ${type}`,
      });
    } else {
      reply.status(400).send({ message: "Invalid type of change" });
    }
  } catch (error: any) {
    if (error?.message === "User not found") {
      reply.status(404).send({ message: "User not found" });
    } else {
      reply.status(500).send({ message: "Failed to update user", error: error?.message || "Unknown error" });
    }
  }
}

export async function deleteAccount(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { email } = request.params as { email: string };

    const users = await getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    await AdminAuthService.deleteUser(user.id);

    reply.clearCookie("accessToken", { path: "/" });
    reply.clearCookie("refreshToken", { path: "/" });

    reply
      .status(200)
      .send({ message: `${user.email} has been Successfully Deleted` });
  } catch (error: any) {
    reply.status(500).send({ message: "Failed to delete account", error: error?.message || "Unknown error" });
  }
}

export async function showAllUsers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const users = await getAllUsers();

    if (users.length === 0) {
      return reply.status(404).send({ message: "No Users Found" });
    }
    
    return reply.status(200).send(users);
  } catch (error: any) {
    reply.status(500).send({ message: "Failed to fetch users", error: error?.message || "Unknown error" });
  }
}
