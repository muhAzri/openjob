import { Router } from 'express';
import type { Routes } from './Routes';
import type { BookmarkController } from '../controllers/BookmarkController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';

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
      this.controller.postBookmark,
    );

    router.get(
      '/jobs/:jobId/bookmark/:id',
      this.authMiddleware.authenticate,
      this.controller.getBookmarkDetail,
    );

    router.delete(
      '/jobs/:jobId/bookmark',
      this.authMiddleware.authenticate,
      this.controller.deleteBookmark,
    );

    return router;
  }
}
