import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { RegisterUserUseCase } from "../../application/use-cases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/use-cases/LoginUserUserCase";
import { AuthMiddleware } from "../../infrastructure/middlewares/AuthMiddleware";
import { TokenPayload } from "../../domain/value-objects/TokenPayload";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialError";
import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUseCase";

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly authMiddleware: AuthMiddleware,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
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

        const { accessToken, refreshToken } = await this.loginUserUseCase.execute(email, password);

        reply
          .setCookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          })
          .code(200)
          .send({ token: accessToken });

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
        if (!(request as FastifyRequest & { user: TokenPayload }).user) {
          return reply.code(401).send({ error: "Unauthorized" });
        }

        reply.send({ message: "You have accessed a protected route!", user: (request as FastifyRequest & { user: TokenPayload }).user });
      }
    );

    app.post("/refresh-token", async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
          return reply.code(401).send({ error: "Refresh token missing" });
        }

        const accessToken = await this.refreshTokenUseCase.execute(refreshToken);

        reply.code(200).send({ accessToken });
      } catch (error) {
        console.error("Error in token refresh:", error);
        reply.code(401).send({ error: "Invalid or expired refresh token" });
      }
    });

  }
}
