import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export interface IAuthService {
    generateToken(payload: object, expiresIn: string, type: "access" | "refresh"): string;
    verifyToken(token: string, type: "access" | "refresh"): string | TokenPayload;
}