import { IUserRepository } from "../../application/ports/IUserRepository";
import { User } from "../../domain/entities/User";
import { prisma } from "../database/prisma";

export class PrismaUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    return record
      ? new User(record.id, record.name, record.email, record.passwordHash)
      : null;
  }
}