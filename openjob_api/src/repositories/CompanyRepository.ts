import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { Company, CompanySummary } from '../domain/entities/Company';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '../domain/dto/CompanyDto';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface CompanyRow extends QueryResultRow {
  id: string;
  name: string;
  description: string | null;
  location: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

interface CompanySummaryRow extends QueryResultRow {
  id: string;
  name: string;
  description: string | null;
  location: string;
  owner_id: string;
  created_at: Date;
}

const SELECT_COLUMNS = 'id, name, description, location, owner_id, created_at, updated_at';
const LIST_COLUMNS = 'id, name, description, location, owner_id, created_at';

export class CompanyRepository {
  constructor(private readonly database: Database) {}

  public async create(ownerId: string, payload: CreateCompanyPayload): Promise<Company> {
    const result = await this.database.query<CompanyRow>(
      `INSERT INTO companies (name, description, location, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_COLUMNS}`,
      [payload.name, payload.description ?? null, payload.location, ownerId],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal menambahkan company');
    }
    return row;
  }

  public async findAll(): Promise<CompanySummary[]> {
    const result = await this.database.query<CompanySummaryRow>(
      `SELECT ${LIST_COLUMNS} FROM companies ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  public async findById(id: string): Promise<Company> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Company tidak ditemukan');
    }

    const result = await this.database.query<CompanyRow>(
      `SELECT ${SELECT_COLUMNS} FROM companies WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Company tidak ditemukan');
    }
    return row;
  }

  public async update(id: string, payload: UpdateCompanyPayload): Promise<Company> {
    const existing = await this.findById(id);

    const result = await this.database.query<CompanyRow>(
      `UPDATE companies
       SET name = $1, description = $2, location = $3, updated_at = now()
       WHERE id = $4
       RETURNING ${SELECT_COLUMNS}`,
      [
        payload.name ?? existing.name,
        payload.description ?? existing.description,
        payload.location ?? existing.location,
        id,
      ],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Company tidak ditemukan');
    }
    return row;
  }

  public async delete(id: string): Promise<void> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Company tidak ditemukan');
    }

    const result = await this.database.query('DELETE FROM companies WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }
  }
}
