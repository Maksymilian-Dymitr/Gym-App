import bcrypt from "bcrypt";
import { findByEmail, findById, findByGoogleId, findByEmailOrGoogleId, create, updateGoogleId } from "../../repository/User.repository";

export class UserAuthService {
  static async findUser(type: string, verificationData: string) {
    const allowedTypes = ["email", "id", "google_id"];

    if (!allowedTypes.includes(type)) {
      throw new Error("Invalid Type");
    }

    let user;
    switch (type) {
      case "email":
        user = await findByEmail(verificationData);
        break;
      case "id":
        user = await findById(verificationData);
        break;
      case "google_id":
        user = await findByGoogleId(verificationData);
        break;
      default:
        throw new Error("Invalid Type");
    }

    if (!user) {
      throw new Error("No User Found");
    }

    return user;
  }

  static async loginUser(email: string, password: string) {
    const user = await this.findUser("email", email);
    
    const isValid = await bcrypt.compare(password, user.password || "");
    
    if (!isValid) {
      throw new Error("Invalid password");
    }
    
    return user;
  }

  static async exchangeCodeForToken(code: string) {
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

  static async getGoogleUserInfo(accessToken: string) {
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
      google_id: userinfo.id, 
      email: userinfo.email
    };
  }

  static async findOrCreateGoogleUser(google_id: string, email: string) {
    const users = await findByEmailOrGoogleId(email, google_id);

    let user;

    if (users.length === 0) {
      user = await create({
        email,
        google_id,
        password: "",
        role: "User"
      });
    } else {
      user = users[0];
      
      if (user && !user.google_id) {
        await updateGoogleId(user.id, google_id);
        user.google_id = google_id;
      }
    }

    if (!user) {
      throw new Error("Failed to create or retrieve user");
    }

    return user;
  }

  static async googleOAuthService(code: string) {
    const accessToken = await this.exchangeCodeForToken(code);
    const { google_id, email } = await this.getGoogleUserInfo(accessToken);
    const user = await this.findOrCreateGoogleUser(google_id, email);

    return { user, email };
  }

}
