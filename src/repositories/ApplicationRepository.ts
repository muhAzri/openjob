import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Application, ApplicationStatus } from '../domain/entities/Application';
import type { CreateApplicationPayload } from '../domain/dto/ApplicationDto';
import { InvariantError, NotFoundError } from '../errors';

interface ApplicationRow extends QueryResultRow {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}

const SELECT_COLUMNS =
  'id, job_id, user_id, cover_letter, status, created_at, updated_at';

export class ApplicationRepository {
  constructor(private readonly database: Database) {}

  public async create(userId: string, payload: CreateApplicationPayload): Promise<Application> {
    const result = await this.database.query<ApplicationRow>(
      `INSERT INTO applications (job_id, user_id, cover_letter)
       VALUES ($1, $2, $3)
       RETURNING ${SELECT_COLUMNS}`,
      [payload.jobId, userId, payload.coverLetter ?? null],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan lamaran');
    }
    return this.toEntity(row);
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
    return result.rows.map((row) => this.toEntity(row));
  }

  public async findById(id: string): Promise<Application> {
    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }
    return this.toEntity(row);
  }

  public async findByUserId(userId: string): Promise<Application[]> {
    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return result.rows.map((row) => this.toEntity(row));
  }

  public async findByJobId(jobId: string): Promise<Application[]> {
    const result = await this.database.query<ApplicationRow>(
      `SELECT ${SELECT_COLUMNS} FROM applications WHERE job_id = $1 ORDER BY created_at DESC`,
      [jobId],
    );
    return result.rows.map((row) => this.toEntity(row));
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
    return this.toEntity(row);
  }

  public async delete(id: string): Promise<void> {
    const result = await this.database.query('DELETE FROM applications WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }
  }

  private toEntity(row: ApplicationRow): Application {
    return {
      id: row.id,
      jobId: row.job_id,
      userId: row.user_id,
      coverLetter: row.cover_letter,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
