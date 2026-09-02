import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { User, UserRole } from '../domain/entities/User';
import type { UpdateUserPayload } from '../domain/dto/AuthDto';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface UserRow extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

const SELECT_COLUMNS = 'id, name, email, password, role, created_at, updated_at';

export class UserRepository {
  constructor(private readonly database: Database) {}

  public async create(name: string, email: string, hashedPassword: string, role: UserRole): Promise<User> {
    const result = await this.database.query<UserRow>(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [name, email, hashedPassword, role],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan user');
    }
    return row;
  }

  public async isEmailAvailable(email: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    return result.rowCount === 0;
  }

  public async findById(id: string): Promise<User> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const result = await this.database.query<UserRow>(
      `SELECT ${SELECT_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return row;
  }

  public async findByEmail(email: string): Promise<User> {
    const result = await this.database.query<UserRow>(
      `SELECT ${SELECT_COLUMNS} FROM users WHERE email = $1`,
      [email],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return row;
  }

  public async isEmailAvailableForUpdate(email: string, excludingUserId: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, excludingUserId],
    );
    return result.rowCount === 0;
  }

  public async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const existing = await this.findById(id);

    const result = await this.database.query<UserRow>(
      `UPDATE users
       SET name = $1, email = $2, updated_at = now()
       WHERE id = $3
       RETURNING ${SELECT_COLUMNS}`,
      [payload.name ?? existing.name, payload.email ?? existing.email, id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return row;
  }
}
