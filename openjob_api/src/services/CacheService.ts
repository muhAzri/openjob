import { RedisClient } from '../config/RedisClient';
import { envConfig } from '../config/EnvConfig';

export class CacheService {
  public static async get(key: string): Promise<string | null> {
    try {
      const client = RedisClient.getInstance();
      return await client.get(key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Gagal membaca cache Redis untuk key "${key}":`, error);
      return null;
    }
  }

  public static async set(
    key: string,
    value: string,
    ttlSeconds: number = envConfig.cacheTtlSeconds,
  ): Promise<void> {
    try {
      const client = RedisClient.getInstance();
      await client.setEx(key, ttlSeconds, value);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Gagal menulis cache Redis untuk key "${key}":`, error);
    }
  }

  public static async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    try {
      const client = RedisClient.getInstance();
      await client.del(keys);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Gagal menghapus cache Redis untuk key "${keys.join(', ')}":`, error);
    }
  }
}
