import { IUserRepository } from "../ports/IUserRepository";
import { User } from "../../domain/entities/User";
import { PasswordService } from "../../domain/services/PasswordService";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.passwordService.hashPassword(password)
    const user = User.create(name, email, hashedPassword);
    await this.userRepository.save(user);
    return user;
  }
}