import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";

interface GoogleTokenResult {
  iss?: string; // Issuer of the token
  azp?: string; // Authorized party
  aud?: string; // Audience of the token
  sub?: string; // Subject (unique identifier for the user)
  email?: string; // User's email address
  email_verified?: string; // Indicates if the email is verified (boolean string)
  nbf?: string; // "Not Before" time (when the token becomes valid)
  name?: string; // Full name of the user
  picture?: string; // URL of the user's profile picture
  given_name?: string; // User's given name (first name)
  family_name?: string; // User's family name (last name)
  iat?: string; // Issued At time (timestamp)
  exp?: string; // Expiration time (timestamp)
  jti?: string; // JWT ID (unique identifier for the token)
  alg?: string; // Algorithm used for token signature
  kid?: string; // Key ID used for token signature
  typ?: string; // Type of token (e.g., "JWT")
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const verifyGoogleToken = token;
    const google0authURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    google0authURL.searchParams.set("id_token", verifyGoogleToken);

    const { data } = await axios.get(google0authURL.toString(), {
      responseType: "json",
    });

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          profileImageUrl: data.picture,
        },
      });
    }

    const userInDB = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDB) throw new Error("User with email not found");

    const jwtToken = JWTService.generateTokenForUSer(userInDB);
    console.log(data, "data");

    return jwtToken;
  },
};

export const resolvers = { queries };
