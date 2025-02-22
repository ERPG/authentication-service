export interface IEventBusService {
    publish(topic: string, message: object): Promise<void>;
    subscribe?(topic: string, callback: (message: any) => Promise<void>): Promise<void>;
}