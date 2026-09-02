import { Pool, type QueryResult, type QueryResultRow } from 'pg';

export class Database {
  private static instance: Database | undefined;

  private readonly pool: Pool;

  private constructor() {
    // `pg.Pool` reads PGUSER, PGPASSWORD, PGDATABASE, PGHOST and PGPORT
    // from the environment automatically when no config is passed.
    this.pool = new Pool();
  }

  public static getInstance(): Database {
    Database.instance ??= new Database();
    return Database.instance;
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: readonly unknown[],
  ): Promise<QueryResult<T>> {
    return await this.pool.query<T>(text, params as unknown[]);
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
