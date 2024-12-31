export class Email {
    private constructor(public readonly value: string) {}
  
    static create(email: string): Email {
      if (!this.validate(email)) {
        throw new Error("Invalid email format");
      }
      return new Email(email);
    }
  
    private static validate(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }