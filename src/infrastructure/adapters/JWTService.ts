import jwt from "jsonwebtoken";
import { IAuthService } from "../../application/ports/IAuthService";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export class JWTService implements IAuthService {
  private readonly accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
  private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;

  generateToken(payload: TokenPayload, expiresIn: string, type: "access" | "refresh"): string {
    const secret = type === "access" ? this.accessTokenSecret : this.refreshTokenSecret;
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        ...payload.claims,
      },
      secret,
      { expiresIn }
    );
  }

  verifyToken(token: string, type: "access" | "refresh"): TokenPayload {
    const secret = type === "access" ? this.accessTokenSecret : this.refreshTokenSecret;

    try {
      const decoded = jwt.verify(token, secret);

      if (typeof decoded === "object" && decoded !== null) {
        return new TokenPayload(
          decoded.userId,
          decoded.email,
          decoded.role,
          { ...decoded }
        );
      }
      throw new Error("Invalid token payload");
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error("Invalid or expired token");
    }
  }
}