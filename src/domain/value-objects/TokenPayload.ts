export class TokenPayload {
    constructor(
      public readonly userId: string,
      public readonly email: string,
      public readonly role?: string,
      public readonly claims?: Record<string, any>
    ) {}

    isAdmin(): boolean {
      return this.role === "admin";
    }
  }