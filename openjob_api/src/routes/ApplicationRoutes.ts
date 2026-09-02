import { Router } from 'express';
import type { Routes } from './Routes';
import type { ApplicationController } from '../controllers/ApplicationController';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { ValidationMiddleware } from '../middlewares/ValidationMiddleware';
import { ApplicationValidator } from '../validators/ApplicationValidator';
import { UploadMiddleware } from '../middlewares/UploadMiddleware';
import { CacheMiddleware } from '../middlewares/CacheMiddleware';
import { CacheKeys } from '../config/CacheKeys';

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
      CacheMiddleware.cache((req) => CacheKeys.applicationsByUser(req.params['userId'] as string)),
      this.controller.getApplicationsByUser,
    );

    router.get(
      '/job/:jobId',
      CacheMiddleware.cache((req) => CacheKeys.applicationsByJob(req.params['jobId'] as string)),
      this.controller.getApplicationsByJob,
    );

    router.get(
      '/:id',
      CacheMiddleware.cache((req) => CacheKeys.applicationDetail(req.params['id'] as string)),
      this.controller.getApplicationById,
    );

    router.put(
      '/:id',
      ValidationMiddleware.validateBody(ApplicationValidator.validateUpdatePayload),
      this.controller.putApplication,
    );

    router.delete('/:id', this.controller.deleteApplication);

    router.post(
      '/:id/resume',
      UploadMiddleware.resume('resume'),
      this.controller.postApplicationResume,
    );

    router.get('/:id/resume', this.controller.getApplicationResume);

    return router;
  }
}
