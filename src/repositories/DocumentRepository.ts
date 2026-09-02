import type { QueryResultRow } from 'pg';
import type { Database } from '../config/Database';
import type { DocumentRecord } from '../domain/entities/Document';
import { InvariantError, NotFoundError } from '../errors';
import { isValidUuid } from '../utils/Uuid';

interface DocumentRow extends QueryResultRow {
  id: string;
  user_id: string;
  filename: string;
  original_name: string;
  size: number;
  mime_type: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateDocumentInput {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

const SELECT_COLUMNS = 'id, user_id, filename, original_name, size, mime_type, created_at, updated_at';

export class DocumentRepository {
  constructor(private readonly database: Database) {}

  public async create(userId: string, input: CreateDocumentInput): Promise<DocumentRecord> {
    const result = await this.database.query<DocumentRow>(
      `INSERT INTO documents (user_id, filename, original_name, size, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${SELECT_COLUMNS}`,
      [userId, input.filename, input.originalName, input.size, input.mimeType],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new InvariantError('Gagal mengunggah dokumen');
    }
    return row;
  }

  public async findAll(): Promise<DocumentRecord[]> {
    const result = await this.database.query<DocumentRow>(
      `SELECT ${SELECT_COLUMNS} FROM documents ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  public async findById(id: string): Promise<DocumentRecord> {
    if (!isValidUuid(id)) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    const result = await this.database.query<DocumentRow>(
      `SELECT ${SELECT_COLUMNS} FROM documents WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (row === undefined) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }
    return row;
  }

  public async delete(id: string): Promise<void> {
    const result = await this.database.query('DELETE FROM documents WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }
  }
}
