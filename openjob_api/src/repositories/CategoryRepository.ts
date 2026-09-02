import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Category } from '../domain/entities/Category';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../domain/dto/CategoryDto';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface CategoryRow extends QueryResultRow {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

const SELECT_COLUMNS = 'id, name, created_at, updated_at';

export class CategoryRepository {
  constructor(private readonly database: Database) {}

  public async create(payload: CreateCategoryPayload): Promise<Category> {
    const result = await this.database.query<CategoryRow>(
      `INSERT INTO categories (name) VALUES ($1)
       RETURNING ${SELECT_COLUMNS}`,
      [payload.name],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan category');
    }
    return row;
  }

  public async findAll(): Promise<Category[]> {
    const result = await this.database.query<CategoryRow>(
      `SELECT ${SELECT_COLUMNS} FROM categories ORDER BY name ASC`,
    );
    return result.rows;
  }

  public async findById(id: string): Promise<Category> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Category tidak ditemukan');
    }

    const result = await this.database.query<CategoryRow>(
      `SELECT ${SELECT_COLUMNS} FROM categories WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Category tidak ditemukan');
    }
    return row;
  }

  public async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    const existing = await this.findById(id);

    const result = await this.database.query<CategoryRow>(
      `UPDATE categories SET name = $1, updated_at = now()
       WHERE id = $2
       RETURNING ${SELECT_COLUMNS}`,
      [payload.name ?? existing.name, id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Category tidak ditemukan');
    }
    return row;
  }

  public async delete(id: string): Promise<void> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Category tidak ditemukan');
    }

    const result = await this.database.query('DELETE FROM categories WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }
  }
}
