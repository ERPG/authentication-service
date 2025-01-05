import fastify, { FastifyInstance } from "fastify";
import { UserController } from "./interfaces/http/UserController";
import { RegisterUserUseCase } from "./application/use-cases/RegisterUserUseCase";
import { PrismaUserRepository } from "./infrastructure/adapters/PrismaUserRepository";
import { PasswordService } from "./domain/services/PasswordService";
import { LoginUserUseCase } from "./application/use-cases/LoginUserUserCase";
import { JWTService } from "./infrastructure/adapters/JWTService";
import { AuthMiddleware } from "./infrastructure/middlewares/AuthMiddleware";
import { HealthController } from "./interfaces/http/HealthController";
import fastifyCookie from "@fastify/cookie";
import { RefreshTokenUseCase } from "./application/use-cases/RefreshTokenUseCase";

const app: FastifyInstance = fastify();

app.register(fastifyCookie)

// dependencies
const userRepository = new PrismaUserRepository();
const jwtService = new JWTService();
const passwordService = new PasswordService();
const authService = new JWTService();

// Use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordService, authService);
const refreshTokenUseCase = new RefreshTokenUseCase(authService);

// Instantiate middleware
const authMiddleware = new AuthMiddleware(jwtService);

// Controllers
const userController = new UserController(registerUserUseCase, loginUserUseCase, authMiddleware, refreshTokenUseCase);

//routes
userController.registerRoutes(app);
HealthController.registerRoutes(app);

app.listen({ port: 3000 }, () => {
  console.log("Authentication service running on http://localhost:3000");
});

export type AppInstance = typeof app;