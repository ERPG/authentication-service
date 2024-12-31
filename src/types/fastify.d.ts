import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      email: string;
      [key: string]: any;
    } | null;
  }
}