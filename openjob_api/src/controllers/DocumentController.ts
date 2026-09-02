import path from 'node:path';
import type { Request, Response } from 'express';
import type { DocumentService } from '../services/DocumentService';
import { requireUserId } from './RequestUser';
import { DOCUMENT_UPLOAD_DIR } from '../middlewares/UploadMiddleware';
import { InvariantError } from '../errors';

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  public postDocument = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    if (req.file === undefined) {
      throw new InvariantError('File is required and must be in PDF format');
    }

    const document = await this.documentService.upload(userId, req.file);
    res.status(201).json({
      status: 'success',
      message: 'Dokumen berhasil diunggah',
      data: document,
    });
  };

  public getDocuments = async (_req: Request, res: Response): Promise<void> => {
    const documents = await this.documentService.getAll();
    res.status(200).json({
      status: 'success',
      data: { documents },
    });
  };

  public getDocumentById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const document = await this.documentService.getById(id);
    const filePath = path.join(DOCUMENT_UPLOAD_DIR, document.filename);
    res.download(filePath, document.original_name);
  };

  public deleteDocument = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    await this.documentService.delete(id, requesterId);
    res.status(200).json({
      status: 'success',
      message: 'Dokumen berhasil dihapus',
    });
  };
}
