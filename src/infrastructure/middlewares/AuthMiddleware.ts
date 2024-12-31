import { FastifyRequest, FastifyReply } from "fastify";
import { JWTService } from "../adapters/JWTService";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";

export class AuthMiddleware {
  constructor(private readonly jwtService: JWTService) { }

  async verifyToken(request: FastifyRequest, reply: FastifyReply) {

    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      reply.code(401).send({ error: "Authorization header is missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = this.jwtService.verifyToken(token);
      (request as FastifyRequest & { user: TokenPayload }).user = payload;
    } catch (error) {
      reply.code(401).send({ error: "Invalid or expired token" });
    }
  }
}