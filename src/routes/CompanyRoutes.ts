import { Router } from 'express';
import type { Routes } from './Routes';
import type { CompanyController } from '../controllers/CompanyController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { CompanyValidator } from '../validators/CompanyValidator';
import { CacheMiddleware } from '../middlewares/CacheMiddleware';
import { CacheKeys } from '../config/CacheKeys';

export class CompanyRoutes implements Routes {
  constructor(
    private readonly controller: CompanyController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.get('/', this.controller.getCompanies);
    router.get(
      '/:id',
      CacheMiddleware.cache((req) => CacheKeys.companyDetail(req.params['id'] as string)),
      this.controller.getCompanyById,
    );

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
