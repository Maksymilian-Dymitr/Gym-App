import { type FastifyReply, type FastifyRequest } from "fastify";
import type { TokenPayLoad } from "../../Types/jwt.type";
import { UserAuthService } from "../../Services/User/auth.service";
import { AdminAuthService } from "../../Services/Admin/auth.service";

export async function signin(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const result = await AdminAuthService.createUser(
      email,
      password,
      "User",
    );

    reply.status(201).send({
      message: "New User has been Created",
      user: result,
    });
  } catch (error: any) {
    reply.status(500).send({ message: "Failed to create user", error: error?.message || "Unknown error" });
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await UserAuthService.loginUser(email, password);

    const accessToken = await reply.jwtSign(
      { id: user.id, role: user.role, type: "access" },
      { expiresIn: "1h" },
    );
    const refreshToken = await reply.jwtSign(
      { id: user.id, role: user.role, type: "refresh" },
      { expiresIn: "30d" },
    );

    reply.setCookie("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const response = { 
      message: "Login Successful", 
      accessToken, 
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role } 
    };
    
    reply.status(200).send(response);
  } catch (error: any) {
    if (error?.message === "No User Found" || error?.message === "Invalid password") {
      return reply.status(401).send({ message: "Invalid credentials" });
    }
    return reply.status(500).send({ message: "Server error", error: error?.message });
  }
}

export async function signout(request: FastifyRequest, reply: FastifyReply) {
  try {
    reply.clearCookie("accessToken", { path: "/" });
    reply.clearCookie("refreshToken", { path: "/" });
    return reply.status(200).send({ message: "Logout Successful" });
  } catch (error: any) {
    return reply.status(500).send({ message: "Failed to logout", error: error?.message });
  }
}

export async function googleCallback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { code } = request.query as { code: string };
    
    if (!code) {
      return reply.status(400).send({ error: "Authorization code not provided" });
    }

    const { user } = await UserAuthService.googleOAuthService(code);

    const accessToken = await reply.jwtSign(
      { id: user.id, role: user.role, type: "access" },
      { expiresIn: "1h" },
    );
    const refreshToken = await reply.jwtSign(
      { id: user.id, role: user.role, type: "refresh" },
      { expiresIn: "30d" },
    );

    reply.setCookie("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return reply.redirect(
      `http://localhost:3001/login-success?token=${accessToken}&userId=${user.id}&role=${user.role}&email=${user.email}`
    );
  } catch (error: any) {
    return reply.status(500).send({ message: "Google OAuth failed", error: error?.message });
  }
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const refresh_token = request.cookies.refreshToken;
    if (!refresh_token) {
      return reply.status(401).send({ message: "No Refresh Token" });
    }

    const decoded = await request.jwtVerify<TokenPayLoad>();
    if (decoded.type !== "refresh") {
      return reply.status(401).send({ message: "Not Authorized" });
    }

    const accessToken = await reply.jwtSign(
      { id: decoded.user_id, role: decoded.role, type: "access" },
      { expiresIn: "1h" },
    );
    const refreshToken = await reply.jwtSign(
      { id: decoded.user_id, role: decoded.role, type: "refresh" },
      { expiresIn: "30d" },
    );

    reply.setCookie("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    reply.setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return reply.status(200).send({ accessToken, refreshToken });
  } catch (error: any) {
    return reply.status(401).send({ message: "Invalid refresh token" });
  }
}
