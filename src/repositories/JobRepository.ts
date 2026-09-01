import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { EmploymentType, Job, JobDetail } from '../domain/entities/Job';
import type { CreateJobPayload, JobQueryParams, UpdateJobPayload } from '../domain/dto/JobDto';
import { InvariantError, NotFoundError } from '../errors';

interface JobRow extends QueryResultRow {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
  category_id: string;
  posted_by: string;
  location: string | null;
  employment_type: EmploymentType;
  salary_min: number | null;
  salary_max: number | null;
  created_at: Date;
  updated_at: Date;
}

interface JobDetailRow extends JobRow {
  company_name: string;
  category_name: string;
}

const DETAIL_SELECT = `SELECT jobs.id, jobs.title, jobs.description, jobs.company_id, jobs.category_id,
    jobs.posted_by, jobs.location, jobs.employment_type, jobs.salary_min, jobs.salary_max,
    jobs.created_at, jobs.updated_at,
    companies.name AS company_name, categories.name AS category_name
  FROM jobs
  JOIN companies ON companies.id = jobs.company_id
  JOIN categories ON categories.id = jobs.category_id`;

export class JobRepository {
  constructor(private readonly database: Database) {}

  public async create(postedBy: string, payload: CreateJobPayload): Promise<Job> {
    const result = await this.database.query<JobRow>(
      `INSERT INTO jobs (title, description, company_id, category_id, posted_by, location, employment_type, salary_min, salary_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, description, company_id, category_id, posted_by, location, employment_type, salary_min, salary_max, created_at, updated_at`,
      [
        payload.title,
        payload.description ?? null,
        payload.companyId,
        payload.categoryId,
        postedBy,
        payload.location ?? null,
        payload.employmentType ?? 'full-time',
        payload.salaryMin ?? null,
        payload.salaryMax ?? null,
      ],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan job');
    }
    return this.toEntity(row);
  }

  public async findAll(query: JobQueryParams): Promise<JobDetail[]> {
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
    const result = await this.database.query<JobDetailRow>(
      `${DETAIL_SELECT}${whereClause} ORDER BY jobs.created_at DESC`,
      values,
    );
    return result.rows.map((row) => this.toDetailEntity(row));
  }

  public async findById(id: string): Promise<JobDetail> {
    const result = await this.database.query<JobDetailRow>(
      `${DETAIL_SELECT} WHERE jobs.id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Job tidak ditemukan');
    }
    return this.toDetailEntity(row);
  }

  public async findByCompanyId(companyId: string): Promise<JobDetail[]> {
    const result = await this.database.query<JobDetailRow>(
      `${DETAIL_SELECT} WHERE jobs.company_id = $1 ORDER BY jobs.created_at DESC`,
      [companyId],
    );
    return result.rows.map((row) => this.toDetailEntity(row));
  }

  public async findByCategoryId(categoryId: string): Promise<JobDetail[]> {
    const result = await this.database.query<JobDetailRow>(
      `${DETAIL_SELECT} WHERE jobs.category_id = $1 ORDER BY jobs.created_at DESC`,
      [categoryId],
    );
    return result.rows.map((row) => this.toDetailEntity(row));
  }

  public async update(id: string, payload: UpdateJobPayload): Promise<Job> {
    const existing = await this.findById(id);

    const result = await this.database.query<JobRow>(
      `UPDATE jobs
       SET title = $1, description = $2, company_id = $3, category_id = $4,
           location = $5, employment_type = $6, salary_min = $7, salary_max = $8, updated_at = now()
       WHERE id = $9
       RETURNING id, title, description, company_id, category_id, posted_by, location, employment_type, salary_min, salary_max, created_at, updated_at`,
      [
        payload.title ?? existing.title,
        payload.description ?? existing.description,
        payload.companyId ?? existing.companyId,
        payload.categoryId ?? existing.categoryId,
        payload.location ?? existing.location,
        payload.employmentType ?? existing.employmentType,
        payload.salaryMin ?? existing.salaryMin,
        payload.salaryMax ?? existing.salaryMax,
        id,
      ],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Job tidak ditemukan');
    }
    return this.toEntity(row);
  }

  public async delete(id: string): Promise<void> {
    const result = await this.database.query('DELETE FROM jobs WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Job tidak ditemukan');
    }
  }

  private toEntity(row: JobRow): Job {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      companyId: row.company_id,
      categoryId: row.category_id,
      postedBy: row.posted_by,
      location: row.location,
      employmentType: row.employment_type,
      salaryMin: row.salary_min,
      salaryMax: row.salary_max,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private toDetailEntity(row: JobDetailRow): JobDetail {
    return {
      ...this.toEntity(row),
      companyName: row.company_name,
      categoryName: row.category_name,
    };
  }
}
