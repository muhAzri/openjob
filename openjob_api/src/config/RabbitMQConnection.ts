import amqplib, { type ChannelModel, type Channel } from 'amqplib';
import { envConfig } from './EnvConfig';

export class RabbitMQConnection {
  private static connection: ChannelModel | undefined;
  private static channel: Channel | undefined;

  private constructor() {}

  public static async getChannel(): Promise<Channel> {
    if (RabbitMQConnection.channel !== undefined) {
      return RabbitMQConnection.channel;
    }

    RabbitMQConnection.connection = await amqplib.connect(envConfig.amqpUrl);
    RabbitMQConnection.channel = await RabbitMQConnection.connection.createChannel();
    await RabbitMQConnection.channel.assertQueue(envConfig.applicationsQueue, { durable: true });

    return RabbitMQConnection.channel;
  }

  public static async close(): Promise<void> {
    await RabbitMQConnection.channel?.close();
    await RabbitMQConnection.connection?.close();
    RabbitMQConnection.channel = undefined;
    RabbitMQConnection.connection = undefined;
  }
}
