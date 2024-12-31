import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUserCase";
import { AuthMiddleware } from "../../infrastructure/middlewares/AuthMiddleware";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialError";

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly authMiddleware: AuthMiddleware,
  ) { }

  registerRoutes(app: FastifyInstance) {
  
    app.post("/register", async (
      request: FastifyRequest<{ Body: { name: string; email: string; password: string } }>,
      reply: FastifyReply
    ) => {
      const { name, email, password } = request.body;
      try {
        const user = await this.registerUserUseCase.execute(name, email, password);
        reply.code(201).send({ id: user.id, name: user.name, email: user.email });
      } catch (error: unknown) {
        reply.code(400).send({ error: (error as Error).message });
      }
    });

    app.post("/login", async (
      request: FastifyRequest<{ Body: { email: string; password: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { email, password } = request.body;
        const token = await this.loginUserUseCase.execute(email, password);

        reply.code(200).send({ token });
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          reply.code(400).send({ error: "Invalid email or password." });
        } else {
          console.error("Unexpected error in login:", error);
          reply.code(500).send({ error: "Internal Server Error" });
        }
      }
    });

    app.get(
      "/protected",
      { preHandler: this.authMiddleware.verifyToken.bind(this.authMiddleware) },
      async (request: FastifyRequest, reply) => {
        if (!(request as FastifyRequest & {user: TokenPayload}).user) {
          return reply.code(401).send({ error: "Unauthorized" });
        }
      
        reply.send({ message: "You have accessed a protected route!", user: (request as FastifyRequest & {user: TokenPayload}).user });
      }
    );
  }
}
