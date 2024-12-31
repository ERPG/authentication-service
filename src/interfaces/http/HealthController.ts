import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export class HealthController {
  static registerRoutes(app: FastifyInstance) {
    app.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.send({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }
}