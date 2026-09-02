import path from 'node:path';
import fs from 'node:fs';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { randomUUID } from 'node:crypto';
import { InvariantError } from '../errors';

export const RESUME_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes');
export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['application/pdf']);

if (!fs.existsSync(RESUME_UPLOAD_DIR)) {
  fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, RESUME_UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || '.pdf';
    callback(null, `${randomUUID()}${extension}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
  const hasAllowedExtension = path.extname(file.originalname).toLowerCase() === '.pdf';
  if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !hasAllowedExtension) {
    callback(new InvariantError('Berkas harus berformat PDF'));
    return;
  }
  callback(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_RESUME_SIZE_BYTES },
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
}
