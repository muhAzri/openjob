import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Job, JobDetail, JobSummary, JobType } from '../domain/entities/Job';
import type { CreateJobPayload, JobQueryParams, UpdateJobPayload } from '../domain/dto/JobDto';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface JobRow extends QueryResultRow {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
  category_id: string;
  posted_by: string;
  job_type: JobType;
  experience_level: string | null;
  location_type: string | null;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_visible: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface JobDetailRow extends JobRow {
  company_name: string;
  category_name: string;
}

interface JobSummaryRow extends QueryResultRow {
  id: string;
  title: string;
  company_id: string;
  company_name: string;
  category_id: string;
  category_name: string;
  job_type: JobType;
  location_type: string | null;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_visible: boolean;
  status: string;
}

const JOB_COLUMNS = `jobs.id, jobs.title, jobs.description, jobs.company_id, jobs.category_id,
    jobs.posted_by, jobs.job_type, jobs.experience_level, jobs.location_type, jobs.location_city,
    jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status,
    jobs.created_at, jobs.updated_at`;

const DETAIL_SELECT = `SELECT ${JOB_COLUMNS},
    companies.name AS company_name, categories.name AS category_name
  FROM jobs
  JOIN companies ON companies.id = jobs.company_id
  JOIN categories ON categories.id = jobs.category_id`;

const SUMMARY_COLUMNS = `jobs.id, jobs.title, jobs.company_id, jobs.category_id,
    jobs.job_type, jobs.location_type, jobs.location_city,
    jobs.salary_min, jobs.salary_max, jobs.is_salary_visible, jobs.status`;

const SUMMARY_SELECT = `SELECT ${SUMMARY_COLUMNS},
    companies.name AS company_name, categories.name AS category_name
  FROM jobs
  JOIN companies ON companies.id = jobs.company_id
  JOIN categories ON categories.id = jobs.category_id`;

export class JobRepository {
  constructor(private readonly database: Database) {}

  public async create(postedBy: string, payload: CreateJobPayload): Promise<Job> {
    const result = await this.database.query<JobRow>(
      `INSERT INTO jobs (
         title, description, company_id, category_id, posted_by,
         job_type, experience_level, location_type, location_city,
         salary_min, salary_max, is_salary_visible, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, title, description, company_id, category_id, posted_by,
         job_type, experience_level, location_type, location_city,
         salary_min, salary_max, is_salary_visible, status, created_at, updated_at`,
      [
        payload.title,
        payload.description ?? null,
        payload.company_id,
        payload.category_id,
        postedBy,
        payload.job_type ?? 'full-time',
        payload.experience_level ?? null,
        payload.location_type ?? null,
        payload.location_city ?? null,
        payload.salary_min ?? null,
        payload.salary_max ?? null,
        payload.is_salary_visible ?? true,
        payload.status ?? 'open',
      ],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan job');
    }
    return row;
  }

  public async findAll(query: JobQueryParams): Promise<JobSummary[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (query.title !== undefined && query.title !== '') {
      values.push(`%${query.title}%`);
      conditions.push(`jobs.title ILIKE $${values.length}`);
    }
    if (query.companyName !== undefined && query.companyName !== '') {
      values.push(`%${query.companyName}%`);
      conditions.push(`companies.name ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
    const result = await this.database.query<JobSummaryRow>(
      `${SUMMARY_SELECT}${whereClause} ORDER BY jobs.created_at DESC`,
      values,
    );
    return result.rows;
  }

  public async findById(id: string): Promise<JobDetail> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    const result = await this.database.query<JobDetailRow>(`${DETAIL_SELECT} WHERE jobs.id = $1`, [
      id,
    ]);

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Job tidak ditemukan');
    }
    return row;
  }

  public async findByCompanyId(companyId: string): Promise<JobSummary[]> {
    if (!isValidUuid(companyId)) {
      return [];
    }

    const result = await this.database.query<JobSummaryRow>(
      `${SUMMARY_SELECT} WHERE jobs.company_id = $1 ORDER BY jobs.created_at DESC`,
      [companyId],
    );
    return result.rows;
  }

  public async findByCategoryId(categoryId: string): Promise<JobSummary[]> {
    if (!isValidUuid(categoryId)) {
      return [];
    }

    const result = await this.database.query<JobSummaryRow>(
      `${SUMMARY_SELECT} WHERE jobs.category_id = $1 ORDER BY jobs.created_at DESC`,
      [categoryId],
    );
    return result.rows;
  }

  public async update(id: string, payload: UpdateJobPayload): Promise<Job> {
    const existing = await this.findById(id);

    const result = await this.database.query<JobRow>(
      `UPDATE jobs
       SET title = $1, description = $2, company_id = $3, category_id = $4,
           job_type = $5, experience_level = $6, location_type = $7, location_city = $8,
           salary_min = $9, salary_max = $10, is_salary_visible = $11, status = $12, updated_at = now()
       WHERE id = $13
       RETURNING id, title, description, company_id, category_id, posted_by,
         job_type, experience_level, location_type, location_city,
         salary_min, salary_max, is_salary_visible, status, created_at, updated_at`,
      [
        payload.title ?? existing.title,
        payload.description ?? existing.description,
        payload.company_id ?? existing.company_id,
        payload.category_id ?? existing.category_id,
        payload.job_type ?? existing.job_type,
        payload.experience_level ?? existing.experience_level,
        payload.location_type ?? existing.location_type,
        payload.location_city ?? existing.location_city,
        payload.salary_min ?? existing.salary_min,
        payload.salary_max ?? existing.salary_max,
        payload.is_salary_visible ?? existing.is_salary_visible,
        payload.status ?? existing.status,
        id,
      ],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Job tidak ditemukan');
    }
    return row;
  }

  public async delete(id: string): Promise<void> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    const result = await this.database.query('DELETE FROM jobs WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Job tidak ditemukan');
    }
  }
}
