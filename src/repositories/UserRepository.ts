import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { User } from '../domain/entities/User';
import { InvariantError, NotFoundError } from '../errors';

interface UserRow extends QueryResultRow {
  id: string;
  fullname: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository {
  constructor(private readonly database: Database) {}

  public async create(fullname: string, email: string, hashedPassword: string): Promise<User> {
    const result = await this.database.query<UserRow>(
      `INSERT INTO users (fullname, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, password, created_at, updated_at`,
      [fullname, email, hashedPassword],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan user');
    }
    return this.toEntity(row);
  }

  public async isEmailAvailable(email: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    return result.rowCount === 0;
  }

  public async findById(id: string): Promise<User> {
    const result = await this.database.query<UserRow>(
      'SELECT id, fullname, email, password, created_at, updated_at FROM users WHERE id = $1',
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return this.toEntity(row);
  }

  public async findByEmail(email: string): Promise<User> {
    const result = await this.database.query<UserRow>(
      'SELECT id, fullname, email, password, created_at, updated_at FROM users WHERE email = $1',
      [email],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return this.toEntity(row);
  }

  private toEntity(row: UserRow): User {
    return {
      id: row.id,
      fullname: row.fullname,
      email: row.email,
      password: row.password,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
