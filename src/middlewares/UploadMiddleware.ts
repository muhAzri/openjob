import path from 'node:path';
import fs from 'node:fs';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { randomUUID } from 'node:crypto';
import { InvariantError } from '../errors';

export const RESUME_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes');
export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export const DOCUMENT_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'documents');
export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024;
const DOCUMENT_FILE_ERROR_MESSAGE = 'File is required and must be in PDF format';

const ALLOWED_MIME_TYPES = new Set(['application/pdf']);

for (const dir of [RESUME_UPLOAD_DIR, DOCUMENT_UPLOAD_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function makeStorage(uploadDir: string): multer.StorageEngine {
  return multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, uploadDir);
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname) || '.pdf';
      callback(null, `${randomUUID()}${extension}`);
    },
  });
}

function hasPdfExtensionAndMimeType(file: Express.Multer.File): boolean {
  const hasAllowedExtension = path.extname(file.originalname).toLowerCase() === '.pdf';
  return ALLOWED_MIME_TYPES.has(file.mimetype) && hasAllowedExtension;
}

function fileFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
  if (!hasPdfExtensionAndMimeType(file)) {
    callback(new InvariantError('Berkas harus berformat PDF'));
    return;
  }
  callback(null, true);
}

function documentFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void {
  if (!hasPdfExtensionAndMimeType(file)) {
    callback(new InvariantError(DOCUMENT_FILE_ERROR_MESSAGE));
    return;
  }
  callback(null, true);
}

const upload = multer({
  storage: makeStorage(RESUME_UPLOAD_DIR),
  fileFilter,
  limits: { fileSize: MAX_RESUME_SIZE_BYTES },
});

const documentUpload = multer({
  storage: makeStorage(DOCUMENT_UPLOAD_DIR),
  fileFilter: documentFileFilter,
  limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES },
});

export class UploadMiddleware {
  public static resume(fieldName: string): RequestHandler {
    const handler = upload.single(fieldName);
    return (req: Request, res: Response, next: NextFunction): void => {
      handler(req, res, (error: unknown) => {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          next(new InvariantError('Ukuran berkas maksimal 5 MB'));
          return;
        }
        if (error) {
          next(error);
          return;
        }
        if (req.file === undefined) {
          next(new InvariantError('Berkas resume wajib diunggah'));
          return;
        }
        next();
      });
    };
  }

  public static document(fieldName: string): RequestHandler {
    const handler = documentUpload.single(fieldName);
    return (req: Request, res: Response, next: NextFunction): void => {
      handler(req, res, (error: unknown) => {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
          next(new InvariantError('Ukuran berkas maksimal 5 MB'));
          return;
        }
        if (error) {
          next(error);
          return;
        }
        if (req.file === undefined) {
          next(new InvariantError(DOCUMENT_FILE_ERROR_MESSAGE));
          return;
        }
        next();
      });
    };
  }
}
