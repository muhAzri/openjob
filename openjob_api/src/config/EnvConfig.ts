import { config as loadDotenv } from 'dotenv';

loadDotenv();

class EnvConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly accessTokenKey: string;
  public readonly refreshTokenKey: string;
  public readonly accessTokenAge: number;

  public readonly redisHost: string;
  public readonly redisPort: number;
  public readonly redisPassword: string | undefined;
  public readonly cacheTtlSeconds: number;

  public readonly amqpUrl: string;
  public readonly rabbitmqHost: string;
  public readonly rabbitmqPort: number;
  public readonly rabbitmqUser: string;
  public readonly rabbitmqPassword: string;
  public readonly applicationsQueue: string;

  constructor() {
    this.host = this.readRequired('HOST');
    this.port = Number(this.readRequired('PORT'));
    this.accessTokenKey = this.readRequired('ACCESS_TOKEN_KEY');
    this.refreshTokenKey = this.readRequired('REFRESH_TOKEN_KEY');
    this.accessTokenAge = Number(process.env['ACCESS_TOKEN_AGE'] ?? 10800);

    this.readRequired('PGUSER');
    this.readRequired('PGPASSWORD');
    this.readRequired('PGDATABASE');
    this.readRequired('PGHOST');
    this.readRequired('PGPORT');

    this.redisHost = this.readRequired('REDIS_HOST');
    this.redisPort = Number(process.env['REDIS_PORT'] ?? 6379);
    this.redisPassword =
      process.env['REDIS_PASSWORD'] === '' ? undefined : process.env['REDIS_PASSWORD'];
    this.cacheTtlSeconds = Number(process.env['CACHE_TTL_SECONDS'] ?? 3600);

    this.rabbitmqHost = this.readRequired('RABBITMQ_HOST');
    this.rabbitmqPort = Number(process.env['RABBITMQ_PORT'] ?? 5672);
    this.rabbitmqUser = process.env['RABBITMQ_USER'] ?? 'guest';
    this.rabbitmqPassword = process.env['RABBITMQ_PASSWORD'] ?? 'guest';
    this.amqpUrl =
      process.env['AMQP_URL'] ??
      `amqp://${this.rabbitmqUser}:${this.rabbitmqPassword}@${this.rabbitmqHost}:${this.rabbitmqPort}`;
    this.applicationsQueue = process.env['APPLICATIONS_QUEUE'] ?? 'applications_queue';
  }

  private readRequired(key: string): string {
    const value = process.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}

export const envConfig = new EnvConfig();
