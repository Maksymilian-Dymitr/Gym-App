import { type FastifyReply, type FastifyRequest } from "fastify";
import type { TokenPayLoad } from "../../Types/jwt";
import bcrypt from "bcrypt"
import { findByEmail, findById, findByGoogleId, findByEmailOrGoogleId, create, updateGoogleId } from "../../Repositories/UserRepository";


export async function findUser(
  type: string,
  verificationData: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const allowedTypes = ["email", "id", "google_id"];

  if (!allowedTypes.includes(type)) {
    return reply.status(400).send({ message: "Invalid Type" });
  }

  let user;
  switch (type) {
    case "email":
      user = await findByEmail(verificationData, request);
      break;
    case "id":
      user = await findById(verificationData, request);
      break;
    case "google_id":
      user = await findByGoogleId(verificationData, request);
      break;
    default:
      return reply.status(400).send({ message: "Invalid Type" });
  }

  if (!user) {
    return reply.status(400).send({ message: "No User Found" });
  }

  return user;
}

export async function loginUser(
  email: string,
  password: string,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log("Login attempt for email:", email);
  
  const user = await findUser("email", email, request, reply);

  if (reply.statusCode >= 400) {
    console.log("User not found or error:", reply.statusCode);
    return null;
  }

  console.log("User found:", user.email, "Role:", user.role);
  console.log("Password hash from DB:", user.password?.substring(0, 30) + "...");

  const isValid = await bcrypt.compare(password, user.password || "");
  console.log("Password comparison result:", isValid);
  
  if (!isValid) {
    console.log("Login failed: Invalid password");
    return reply.status(401).send({ message: "False Password" });
  }
  
  console.log("Login successful for:", user.email);
  return user;
}

export async function generateToken(
  id: string,
  role: string,
  reply: FastifyReply,
) {
  const accessToken = await reply.jwtSign(
    { id: id, role: role, type: "access" },
    { expiresIn: "1h" },
  );
  const refreshToken = await reply.jwtSign(
    { id: id, role: role, type: "refresh" },
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

  return { accessToken, refreshToken };
}

export async function exchangeCodeForToken(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth not configured properly");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: "http://localhost:3002/login/google/callback",
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Failed to exchange code for token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

export async function getGoogleUserInfo(accessToken: string) {
  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userInfoResponse.ok) {
    const errorText = await userInfoResponse.text();
    throw new Error(`Failed to get user info: ${errorText}`);
  }

  const userinfo = await userInfoResponse.json();
  return {
    google_id: userinfo.sub,
    email: userinfo.email
  };
}

export async function findOrCreateGoogleUser(google_id: string, email: string, request: FastifyRequest) {
  const users = await findByEmailOrGoogleId(email, google_id, request);

  let user;

  if (users.length === 0) {
    user = await create({
      email,
      google_id,
      password: "",
      role: "User"
    }, request);
  } else {
    user = users[0];
    
    if (user && !user.google_id) {
      await updateGoogleId(user.id, google_id, request);
    }
  }

  if (!user) {
    throw new Error("Failed to create or retrieve user");
  }

  return user;
}

export async function googleOAuthService(
  code: string,
  request: FastifyRequest
) {
  const accessToken = await exchangeCodeForToken(code);
  const { google_id, email } = await getGoogleUserInfo(accessToken);
  const user = await findOrCreateGoogleUser(google_id, email, request);

  return { user, email };
}

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refresh_token  = request.cookies.refreshToken
  if (!refresh_token) {
    return reply.status(401).send({ message: "No Refresh Token" });
  }

  const decoded = await request.jwtVerify<TokenPayLoad>();
  if (decoded.type !== "refresh") {
    return reply.status(401).send({ message: "Not Authorized" });
  }

  const tokens = await generateToken(decoded.user_id, decoded.role, reply);
  return reply.status(200).send(tokens);
}
