import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Bookmark, BookmarkDetail } from '../domain/entities/Bookmark';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface BookmarkRow extends QueryResultRow {
  id: string;
  job_id: string;
  user_id: string;
  created_at: Date;
}

interface BookmarkDetailRow extends QueryResultRow {
  id: string;
  user_id: string;
  job_id: string;
  title: string;
  description: string | null;
  company_id: string;
  company_name: string;
  category_id: string;
  category_name: string;
  job_type: string;
  experience_level: string | null;
  location_type: string | null;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_visible: boolean;
  status: string;
  created_at: Date;
}

const SELECT_COLUMNS = 'id, job_id, user_id, created_at';

const DETAIL_SELECT = `SELECT
    bookmarks.id, bookmarks.user_id, bookmarks.job_id,
    jobs.title, jobs.description, jobs.company_id, companies.name AS company_name,
    jobs.category_id, categories.name AS category_name, jobs.job_type, jobs.experience_level,
    jobs.location_type, jobs.location_city, jobs.salary_min, jobs.salary_max,
    jobs.is_salary_visible, jobs.status, bookmarks.created_at
  FROM bookmarks
  JOIN jobs ON jobs.id = bookmarks.job_id
  JOIN companies ON companies.id = jobs.company_id
  JOIN categories ON categories.id = jobs.category_id`;

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
    return row;
  }

  public async exists(userId: string, jobId: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
      [userId, jobId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  public async findById(id: string): Promise<Bookmark> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    const result = await this.database.query<BookmarkRow>(
      `SELECT ${SELECT_COLUMNS} FROM bookmarks WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
    return row;
  }

  public async findByUserId(userId: string): Promise<Bookmark[]> {
    if (!isValidUuid(userId)) {
      return [];
    }

    const result = await this.database.query<BookmarkRow>(
      `SELECT ${SELECT_COLUMNS} FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  public async findDetailedByUserId(userId: string): Promise<BookmarkDetail[]> {
    if (!isValidUuid(userId)) {
      return [];
    }

    const result = await this.database.query<BookmarkDetailRow>(
      `${DETAIL_SELECT} WHERE bookmarks.user_id = $1 ORDER BY bookmarks.created_at DESC`,
      [userId],
    );
    return result.rows;
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
}
