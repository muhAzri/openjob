import { Router } from 'express';
import type { Routes } from './Routes';
import type { BookmarkController } from '../controllers/BookmarkController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';

export class BookmarkRoutes implements Routes {
  constructor(
    private readonly controller: BookmarkController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.get('/bookmarks', this.authMiddleware.authenticate, this.controller.getBookmarks);

    router.post(
      '/jobs/:jobId/bookmark',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateUuidParam('jobId'),
      this.controller.postBookmark,
    );

    router.get(
      '/jobs/:jobId/bookmark/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateUuidParam('jobId'),
      ValidationMiddleware.validateUuidParam('id'),
      this.controller.getBookmarkDetail,
    );

    router.delete(
      '/jobs/:jobId/bookmark',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateUuidParam('jobId'),
      this.controller.deleteBookmark,
    );

    return router;
  }
}
