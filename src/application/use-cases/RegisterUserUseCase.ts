import { IUserRepository } from "../ports/IUserRepository";
import { User } from "../../domain/entities/User";
import { PasswordService } from "../../domain/services/PasswordService";
import { IEventBusService } from "../ports/IEventBusService";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly eventBus: IEventBusService
  ) { }

  async execute(name: string, email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await this.passwordService.hashPassword(password)
      const user = User.create(name, email, hashedPassword);
      
      await this.userRepository.save(user);

      await this.eventBus.publish("user.created", {
        userId: user.id,
        name: user.name,
        email: user.email,
        createdAt: Date.now()
      });

      return user;
    } catch (error) {

      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred while RegisterUserUseCase - execute");
    }
  }
}