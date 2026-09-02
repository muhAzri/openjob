import { Router } from 'express';
import type { Routes } from './Routes';
import type { AuthenticationController } from '../controllers/AuthenticationController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { AuthValidator } from '../validators/AuthValidator';

export class AuthenticationRoutes implements Routes {
  constructor(
    private readonly controller: AuthenticationController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.post(
      '/',
      ValidationMiddleware.validateBody(AuthValidator.validateLoginPayload),
      this.controller.postAuthentication,
    );

    router.put(
      '/',
      ValidationMiddleware.validateBody(AuthValidator.validateRefreshTokenPayload),
      this.controller.putAuthentication,
    );

    router.delete(
      '/',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(AuthValidator.validateRefreshTokenPayload),
      this.controller.deleteAuthentication,
    );

    return router;
  }
}
