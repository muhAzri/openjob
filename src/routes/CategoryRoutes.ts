import { Router } from 'express';
import type { Routes } from './Routes';
import type { CategoryController } from '../controllers/CategoryController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CategoryValidator } from '../validators/CategoryValidator';

export class CategoryRoutes implements Routes {
  constructor(
    private readonly controller: CategoryController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.get('/', this.controller.getCategories);
    router.get('/:id', this.controller.getCategoryById);

    router.post(
      '/',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(CategoryValidator.validateCreatePayload),
      this.controller.postCategory,
    );

    router.put(
      '/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(CategoryValidator.validateUpdatePayload),
      this.controller.putCategory,
    );

    router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      this.controller.deleteCategory,
    );

    return router;
  }
}
