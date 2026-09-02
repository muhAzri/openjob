import { Router } from 'express';
import type { Routes } from './Routes';
import type { ProfileController } from '../controllers/ProfileController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';

export class ProfileRoutes implements Routes {
  constructor(
    private readonly controller: ProfileController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();
    router.use(this.authMiddleware.authenticate);

    router.get('/', this.controller.getProfile);
    router.get('/applications', this.controller.getMyApplications);
    router.get('/bookmarks', this.controller.getMyBookmarks);

    return router;
  }
}
