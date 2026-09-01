import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Application, ApplicationStatus } from '../domain/entities/Application';
import type { CreateApplicationPayload } from '../domain/dto/ApplicationDto';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface ApplicationRow extends QueryResultRow {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}

const SELECT_COLUMNS = 'id, job_id, user_id, cover_letter, status, created_at, updated_at';

export class ApplicationRepository {
  constructor(private readonly database: Database) {}

  public async create(userId: string, payload: CreateApplicationPayload): Promise<Application> {
    const result = await this.database.query<ApplicationRow>(
      `INSERT INTO applications (job_id, user_id, cover_letter, status)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [payload.job_id, userId, payload.cover_letter ?? null, payload.status ?? 'pending'],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan lamaran');
    }
    return row;
  }

  public async hasAppliedToJob(userId: string, jobId: string): Promise<boolean> {
    const result = await this.database.query<QueryResultRow>(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [userId, jobId],
    );
    return (result.rowCount ?? 0) > 0;
  }

  public async findAll(): Promise<Application[]> {
    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  public async findById(id: string): Promise<Application> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }
    return row;
  }

  public async findByUserId(userId: string): Promise<Application[]> {
    if (!isValidUuid(userId)) {
      return [];
    }

    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  public async findByJobId(jobId: string): Promise<Application[]> {
    if (!isValidUuid(jobId)) {
      return [];
    }

    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE job_id = $1 ORDER BY created_at DESC`,
      [jobId],
    );
    return result.rows;
  }

  public async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const result = await this.database.query<ApplicationRow>(
      `UPDATE applications SET status = $1, updated_at = now()
       WHERE id = $2
       RETURNING ${SELECT_COLUMNS}`,
      [status, id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }
    return row;
  }

  public async delete(id: string): Promise<void> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    const result = await this.database.query('DELETE FROM applications WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }
  }
}
