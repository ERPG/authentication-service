import jwt from "jsonwebtoken";
import { IAuthService } from "../../application/ports/IAuthService";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export class JWTService implements IAuthService {
  private readonly secret = process.env.JWT_SECRET!;

  generateToken(payload: TokenPayload, expiresIn: string): string {
    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        ...payload.claims,
      },
      this.secret,
      { expiresIn }
    );
  }

  verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret);

    if (typeof decoded === "object" && decoded !== null) {
      return new TokenPayload(
        decoded.userId,
        decoded.email,
        decoded.role,
        { ...decoded }
      );
    }
    throw new Error("Invalid token payload");
  }
}