import { IUserRepository } from "../ports/IUserRepository";
import { IAuthService } from "../ports/IAuthService";
import { PasswordService } from "../../domain/services/PasswordService";
import { InvalidCredentialsError } from "../../domain/errors/InvalidCredentialError";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly authService: IAuthService
  ) { }

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.authService.generateToken({ userId: user.id }, "15m", "access");
    const refreshToken = this.authService.generateToken({ userId: user.id }, "7d", "refresh");

    return { accessToken, refreshToken };
  }
}