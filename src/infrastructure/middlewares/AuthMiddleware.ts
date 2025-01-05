import { FastifyRequest, FastifyReply } from "fastify";
import { JWTService } from "../adapters/JWTService";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export class AuthMiddleware {
  constructor(private readonly jwtService: JWTService) {}

  async verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      reply.code(401).send({ error: "Authorization header is missing" });
      return;
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      reply.code(401).send({ error: "Authorization header format is invalid" });
      return;
    }

    const token = tokenParts[1];

    try {
      const payload = this.jwtService.verifyToken(token, "access");
      (request as FastifyRequest & { user: TokenPayload }).user = payload;
    } catch (error) {
      reply.code(401).send({ error: "Invalid or expired token" });
      return;
    }
  }
}