import type { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { JobRepository } from '../repositories/JobRepository';
import type { Application } from '../domain/entities/Application';
import type { CreateApplicationPayload, UpdateApplicationPayload } from '../domain/dto/ApplicationDto';
import { AuthorizationError, InvariantError } from '../errors';

export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  public async apply(userId: string, payload: CreateApplicationPayload): Promise<Application> {
    await this.jobRepository.findById(payload.job_id);

    const hasApplied = await this.applicationRepository.hasAppliedToJob(userId, payload.job_id);
    if (hasApplied) {
      throw new InvariantError('Anda sudah melamar pada job ini');
    }

    return this.applicationRepository.create(userId, payload);
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

    return this.applicationRepository.updateStatus(id, payload.status);
  }

  public async delete(id: string, requesterId: string): Promise<void> {
    const application = await this.applicationRepository.findById(id);

    if (application.user_id === requesterId) {
      await this.applicationRepository.delete(id);
      return;
    }

    const job = await this.jobRepository.findById(application.job_id);
    if (job.posted_by !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak menghapus lamaran ini');
    }

    await this.applicationRepository.delete(id);
  }
}
