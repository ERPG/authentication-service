import './dotenv-config';
import fastify, { FastifyInstance } from "fastify";
import { UserController } from "./interfaces/http/UserController";
import { RegisterUserUseCase } from "./application/use-cases/RegisterUserUseCase";
import { PrismaUserRepository } from "./infrastructure/adapters/PrismaUserRepository";
import { PasswordService } from "./domain/services/PasswordService";
import { LoginUserUseCase } from "./application/use-cases/LoginUserUserCase";
import { JWTService } from "./infrastructure/adapters/JWTService";
import { AuthMiddleware } from "./infrastructure/middlewares/AuthMiddleware";
import { HealthController } from "./interfaces/http/HealthController";
import { RefreshTokenUseCase } from "./application/use-cases/RefreshTokenUseCase";

import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import EventBusService from "./infrastructure/adapters/EventBusService";

const app: FastifyInstance = fastify({ logger: true });

// Register plugins
app.register(fastifyCookie)
app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

// Dependencies
const userRepository = new PrismaUserRepository();
const jwtService = new JWTService();
const passwordService = new PasswordService();
const authService = new JWTService();
const eventBus = new EventBusService(); 

// Use cases
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService, eventBus);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordService, authService);
const refreshTokenUseCase = new RefreshTokenUseCase(authService);

// Instantiate middleware
const authMiddleware = new AuthMiddleware(jwtService);

// Controllers
const userController = new UserController(registerUserUseCase, loginUserUseCase, authMiddleware, refreshTokenUseCase);

//routes
app.register((fastifyInstance, _, done) => {
  userController.registerRoutes(fastifyInstance);
  HealthController.registerRoutes(fastifyInstance);
  done();
}, { prefix: "/api" });

// Event bus 
eventBus.connect();

app.listen({ port: Number(process.env.PORT) }, (err, address) => {
  if (err) {
    console.error('[ERROR]: ', err);
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Authentication service running on ${address}`);
});

export type AppInstance = typeof app;