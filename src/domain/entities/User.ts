import { randomUUID } from "crypto";

export class User {
    constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly email: string,
      public readonly passwordHash: string
    ) {}

  
    static create(name: string, email: string, passwordHash: string): User {
      return new User(this.generateId(), name, email, passwordHash);
    }
  
    private static generateId(): string {
      return randomUUID();
    }
  }