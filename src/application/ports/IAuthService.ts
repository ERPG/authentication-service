import { JwtPayload } from "jsonwebtoken";

export interface IAuthService {
    generateToken(payload: object, expiresIn: string): string;
    verifyToken(token: string): string | JwtPayload;
}