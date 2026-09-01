import { Router } from 'express';
import type { Routes } from './Routes';
import type { CompanyController } from '../controllers/CompanyController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CompanyValidator } from '../validators/CompanyValidator';

export class CompanyRoutes implements Routes {
  constructor(
    private readonly controller: CompanyController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.get('/', this.controller.getCompanies);
    router.get('/:id', this.controller.getCompanyById);

    router.post(
      '/',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(CompanyValidator.validateCreatePayload),
      this.controller.postCompany,
    );

    router.put(
      '/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(CompanyValidator.validateUpdatePayload),
      this.controller.putCompany,
    );

    router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      this.controller.deleteCompany,
    );

    return router;
  }
}
