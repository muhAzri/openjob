import fs from 'node:fs';
import path from 'node:path';
import type { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { JobRepository } from '../repositories/JobRepository';
import type { Application } from '../domain/entities/Application';
import type { CreateApplicationPayload, UpdateApplicationPayload } from '../domain/dto/ApplicationDto';
import { AuthorizationError, InvariantError } from '../errors';
import { RESUME_UPLOAD_DIR } from '../middlewares/UploadMiddleware';
import { CacheService } from './CacheService';
import { CacheKeys } from '../config/CacheKeys';
import { ApplicationPublisher } from '../queue/ApplicationPublisher';

export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  public async apply(userId: string, payload: CreateApplicationPayload): Promise<Application> {
    const job = await this.jobRepository.findById(payload.job_id);

    const hasApplied = await this.applicationRepository.hasAppliedToJob(userId, payload.job_id);
    if (hasApplied) {
      throw new InvariantError('Anda sudah melamar pada job ini');
    }

    const application = await this.applicationRepository.create(userId, payload);

    await CacheService.del(
      CacheKeys.applicationsByUser(userId),
      CacheKeys.applicationsByJob(job.id),
    );
    await ApplicationPublisher.publishApplicationCreated(application.id);

    return application;
  }

  public async getAll(): Promise<Application[]> {
    return this.applicationRepository.findAll();
  }

  public async getById(id: string): Promise<Application> {
    return this.applicationRepository.findById(id);
  }

  public async getByUserId(userId: string): Promise<Application[]> {
    return this.applicationRepository.findByUserId(userId);
  }

  public async getByJobId(jobId: string): Promise<Application[]> {
    return this.applicationRepository.findByJobId(jobId);
  }

  public async updateStatus(
    id: string,
    requesterId: string,
    payload: UpdateApplicationPayload,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    const job = await this.jobRepository.findById(application.job_id);

    if (job.posted_by !== requesterId) {
      throw new AuthorizationError('Hanya pemilik job yang dapat mengubah status lamaran');
    }

    const updated = await this.applicationRepository.updateStatus(id, payload.status);
    await CacheService.del(
      CacheKeys.applicationDetail(id),
      CacheKeys.applicationsByUser(application.user_id),
      CacheKeys.applicationsByJob(application.job_id),
    );
    return updated;
  }

  public async delete(id: string, requesterId: string): Promise<void> {
    const application = await this.applicationRepository.findById(id);

    const invalidateCache = (): Promise<void> =>
      CacheService.del(
        CacheKeys.applicationDetail(id),
        CacheKeys.applicationsByUser(application.user_id),
        CacheKeys.applicationsByJob(application.job_id),
      );

    if (application.user_id === requesterId) {
      await this.applicationRepository.delete(id);
      await invalidateCache();
      return;
    }

    const job = await this.jobRepository.findById(application.job_id);
    if (job.posted_by !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak menghapus lamaran ini');
    }

    await this.applicationRepository.delete(id);
    await invalidateCache();
  }

  public async uploadResume(
    id: string,
    requesterId: string,
    resumeFilename: string,
    resumeOriginalName: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(id);

    if (application.user_id !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak mengunggah resume untuk lamaran ini');
    }

    if (application.resume_filename !== null) {
      const oldFilePath = path.join(RESUME_UPLOAD_DIR, application.resume_filename);
      fs.rm(oldFilePath, { force: true }, () => undefined);
    }

    return this.applicationRepository.attachResume(id, resumeFilename, resumeOriginalName);
  }

  public async getResumeOwner(id: string, requesterId: string): Promise<Application> {
    const application = await this.applicationRepository.findById(id);

    if (application.user_id === requesterId) {
      return application;
    }

    const job = await this.jobRepository.findById(application.job_id);
    if (job.posted_by !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak melihat resume lamaran ini');
    }

    return application;
  }
}
