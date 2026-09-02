import { Router } from 'express';
import type { Routes } from './Routes';
import type { UserController } from '../controllers/UserController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { UserValidator } from '../validators/UserValidator';
import { CacheMiddleware } from '../middlewares/CacheMiddleware';
import { CacheKeys } from '../config/CacheKeys';

export class UserRoutes implements Routes {
  constructor(
    private readonly controller: UserController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.post(
      '/',
      ValidationMiddleware.validateBody(UserValidator.validateRegisterPayload),
      this.controller.postUser,
    );

    router.get(
      '/:id',
      CacheMiddleware.cache((req) => CacheKeys.userDetail(req.params['id'] as string)),
      this.controller.getUserById,
    );

    router.put(
      '/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(UserValidator.validateUpdatePayload),
      this.controller.putUser,
    );

    return router;
  }
}
