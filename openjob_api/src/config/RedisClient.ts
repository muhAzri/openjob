import { createClient, type RedisClientType } from 'redis';
import { envConfig } from './EnvConfig';

export class RedisClient {
  private static instance: RedisClientType | undefined;

  private constructor() {}

  public static getInstance(): RedisClientType {
    if (RedisClient.instance === undefined) {
      RedisClient.instance = createClient({
        socket: {
          host: envConfig.redisHost,
          port: envConfig.redisPort,
        },
        ...(envConfig.redisPassword !== undefined ? { password: envConfig.redisPassword } : {}),
      });

      RedisClient.instance.on('error', (error: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Redis client error:', error);
      });
    }
    return RedisClient.instance;
  }

  public static async connect(): Promise<void> {
    const client = RedisClient.getInstance();
    if (!client.isOpen) {
      await client.connect();
    }
  }
}
