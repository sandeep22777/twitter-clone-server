import { prismaClient } from "../clients/db";
import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../interfaces";

const JWT_SECRET = "$super6";

class JWTService {
  public static generateTokenForUSer(user: User) {
    const paylaod: JWTUser = {
      id: user?.id,
      email: user?.email,
    };

    const token = JWT.sign(paylaod, JWT_SECRET);
    return token;
  }

  public static decodeToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRET) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
