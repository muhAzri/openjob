import { Router } from 'express';
import type { Routes } from './Routes';
import type { JobController } from '../controllers/JobController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { JobValidator } from '../validators/JobValidator';

export class JobRoutes implements Routes {
  constructor(
    private readonly controller: JobController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();

    router.get(
      '/',
      ValidationMiddleware.validateQuery(JobValidator.validateQueryParams),
      this.controller.getJobs,
    );

    router.get(
      '/company/:companyId',
      ValidationMiddleware.validateUuidParam('companyId'),
      this.controller.getJobsByCompany,
    );

    router.get(
      '/category/:categoryId',
      ValidationMiddleware.validateUuidParam('categoryId'),
      this.controller.getJobsByCategory,
    );

    router.get('/:id', ValidationMiddleware.validateUuidParam('id'), this.controller.getJobById);

    router.post(
      '/',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateBody(JobValidator.validateCreatePayload),
      this.controller.postJob,
    );

    router.put(
      '/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateUuidParam('id'),
      ValidationMiddleware.validateBody(JobValidator.validateUpdatePayload),
      this.controller.putJob,
    );

    router.delete(
      '/:id',
      this.authMiddleware.authenticate,
      ValidationMiddleware.validateUuidParam('id'),
      this.controller.deleteJob,
    );

    return router;
  }
}
