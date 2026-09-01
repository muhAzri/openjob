import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Bookmark } from '../domain/entities/Bookmark';
import { InvariantError, NotFoundError } from '../errors';

interface BookmarkRow extends QueryResultRow {
  id: string;
  job_id: string;
  user_id: string;
  created_at: Date;
}

const SELECT_COLUMNS = 'id, job_id, user_id, created_at';

export class BookmarkRepository {
  constructor(private readonly database: Database) {}

  public async create(userId: string, jobId: string): Promise<Bookmark> {
    const result = await this.database.query<BookmarkRow>(
      `INSERT INTO bookmarks (job_id, user_id)
       VALUES ($1, $2)
       RETURNING ${SELECT_COLUMNS}`,
      [jobId, userId],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan bookmark');
    }
    return this.toEntity(row);
  }

  public async exists(userId: string, jobId: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      [userId, jobId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  public async findById(id: string): Promise<Bookmark> {
    const result = await this.database.query<BookmarkRow>(
      `SELECT ${SELECT_COLUMNS} FROM bookmarks WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
    return this.toEntity(row);
  }

  public async findByUserId(userId: string): Promise<Bookmark[]> {
    const result = await this.database.query<BookmarkRow>(
      `SELECT ${SELECT_COLUMNS} FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows.map((row) => this.toEntity(row));
  }

  public async deleteByUserAndJob(userId: string, jobId: string): Promise<void> {
    const result = await this.database.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      [userId, jobId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
  }

  private toEntity(row: BookmarkRow): Bookmark {
    return {
      id: row.id,
      jobId: row.job_id,
      userId: row.user_id,
      createdAt: row.created_at,
    };
  }
}
