import { Router } from 'express';
import type { Routes } from './Routes';
import type { UserController } from '../controllers/UserController';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { UserValidator } from '../validators/UserValidator';

export class UserRoutes implements Routes {
  constructor(private readonly controller: UserController) {}

  public register(): Router {
    const router = Router();

    router.post(
      '/',
      ValidationMiddleware.validateBody(UserValidator.validateRegisterPayload),
      this.controller.postUser,
    );

    router.get(
      '/:id',
      ValidationMiddleware.validateUuidParam('id'),
      this.controller.getUserById,
    );

    return router;
  }
}
