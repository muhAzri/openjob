import { Router } from 'express';
import type { Routes } from './Routes';
import type { DocumentController } from '../controllers/DocumentController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { UploadMiddleware } from '../middlewares/UploadMiddleware';

export class DocumentRoutes implements Routes {
  constructor(
    private readonly controller: DocumentController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.post(
      '/',
      this.authMiddleware.authenticate,
      UploadMiddleware.document('document'),
      this.controller.postDocument,
    );

    router.get('/', this.controller.getDocuments);
    router.get('/:id', this.controller.getDocumentById);
    router.delete('/:id', this.authMiddleware.authenticate, this.controller.deleteDocument);

    return router;
  }
}
