import { Kafka } from 'kafkajs';
import { IEventBusService } from '../../application/ports/IEventBusService';

class EventBusService implements IEventBusService {
  private kafka;
  private producer;

  constructor() {
    console.log('KAFKA_BROKER: ', process.env.KAFKA_BROKER);
    this.kafka = new Kafka({
      clientId: 'auth-service',
      brokers: [process.env.KAFKA_BROKER as string],
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log('Connected to Kafka (Auth Service)');
  }

  async publish(topic: string, message: object) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

export default EventBusService;