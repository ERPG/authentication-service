import { IAuthService } from "../ports/IAuthService";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export class RefreshTokenUseCase {
    constructor(
      private readonly authService: IAuthService
    ) {}
  
    async execute(refreshToken: string): Promise<string> {
      // Validate the refresh token
      const payload = this.authService.verifyToken(refreshToken, "refresh") as TokenPayload;
      if (!payload) {
        throw new Error("Invalid or expired refresh token");
      }
  
      // Generate a new access token
      const accessToken = this.authService.generateToken(
        { userId: payload.userId },
        "15m",
        "access"
      );
  
      return accessToken;
    }
  }