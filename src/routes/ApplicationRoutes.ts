import { Router } from 'express';
import type { Routes } from './Routes';
import type { ApplicationController } from '../controllers/ApplicationController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { ApplicationValidator } from '../validators/ApplicationValidator';

export class ApplicationRoutes implements Routes {
  constructor(
    private readonly controller: ApplicationController,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  public register(): Router {
    const router = Router();
    router.use(this.authMiddleware.authenticate);

    router.post(
      '/',
      ValidationMiddleware.validateBody(ApplicationValidator.validateCreatePayload),
      this.controller.postApplication,
    );

    router.get('/', this.controller.getApplications);

    router.get(
      '/user/:userId',
      ValidationMiddleware.validateUuidParam('userId'),
      this.controller.getApplicationsByUser,
    );

    router.get(
      '/job/:jobId',
      ValidationMiddleware.validateUuidParam('jobId'),
      this.controller.getApplicationsByJob,
    );

    router.get('/:id', ValidationMiddleware.validateUuidParam('id'), this.controller.getApplicationById);

    router.put(
      '/:id',
      ValidationMiddleware.validateUuidParam('id'),
      ValidationMiddleware.validateBody(ApplicationValidator.validateUpdatePayload),
      this.controller.putApplication,
    );

    router.delete(
      '/:id',
      ValidationMiddleware.validateUuidParam('id'),
      this.controller.deleteApplication,
    );

    return router;
  }
}
