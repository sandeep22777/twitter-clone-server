import { prismaClient } from "../clients/db";
import JWT from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_SECRET = "$super6";

class JWTService {
  public static generateTokenForUSer(user: User) {
    const paylaod = {
      id: user?.id,
      email: user?.email,
    };

    const token = JWT.sign(paylaod, JWT_SECRET);
    return token;
  }
}

export default JWTService;
