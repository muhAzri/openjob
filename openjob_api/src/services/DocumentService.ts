import fs from 'node:fs';
import path from 'node:path';
import type { DocumentRepository } from '../repositories/DocumentRepository';
import type { DocumentRecord } from '../domain/entities/Document';
import { AuthorizationError } from '../errors';
import { DOCUMENT_UPLOAD_DIR } from '../middlewares/UploadMiddleware';

export interface UploadedDocument {
  readonly documentId: string;
  readonly filename: string;
  readonly originalName: string;
  readonly size: number;
}

export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  public async upload(userId: string, file: Express.Multer.File): Promise<UploadedDocument> {
    const document = await this.documentRepository.create(userId, {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    return {
      documentId: document.id,
      filename: document.filename,
      originalName: document.original_name,
      size: document.size,
    };
  }

  public async getAll(): Promise<DocumentRecord[]> {
    return await this.documentRepository.findAll();
  }

  public async getById(id: string): Promise<DocumentRecord> {
    return await this.documentRepository.findById(id);
  }

  public async delete(id: string, requesterId: string): Promise<void> {
    const document = await this.documentRepository.findById(id);
    if (document.user_id !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak menghapus dokumen ini');
    }

    await this.documentRepository.delete(id);
    await fs.promises.unlink(path.join(DOCUMENT_UPLOAD_DIR, document.filename)).catch(() => undefined);
  }
}
