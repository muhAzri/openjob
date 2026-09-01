import { config as loadDotenv } from 'dotenv';

loadDotenv();

class EnvConfig {
  public readonly host: string;
  public readonly port: number;
  public readonly accessTokenKey: string;
  public readonly refreshTokenKey: string;
  public readonly accessTokenAge: number;

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
