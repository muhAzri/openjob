import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import { InvariantError } from '../errors';

export class AuthenticationRepository {
  constructor(private readonly database: Database) {}

  public async addRefreshToken(token: string): Promise<void> {
    await this.database.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  }

  public async verifyRefreshTokenExists(token: string): Promise<void> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT token FROM authentications WHERE token = $1',
      [token],
    );
    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak terdaftar');
    }
  }

  public async deleteRefreshToken(token: string): Promise<void> {
    await this.database.query('DELETE FROM authentications WHERE token = $1', [token]);
  }
}
