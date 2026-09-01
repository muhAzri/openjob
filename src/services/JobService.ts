import type { JobRepository } from '../repositories/JobRepository';
import type { CompanyRepository } from '../repositories/CompanyRepository';
import type { CategoryRepository } from '../repositories/CategoryRepository';
import type { Job, JobDetail } from '../domain/entities/Job';
import type { CreateJobPayload, JobQueryParams, UpdateJobPayload } from '../domain/dto/JobDto';
import { AuthorizationError } from '../errors';

export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async create(postedBy: string, payload: CreateJobPayload): Promise<Job> {
    await this.companyRepository.findById(payload.companyId);
    await this.categoryRepository.findById(payload.categoryId);
    return this.jobRepository.create(postedBy, payload);
  }

  public async getAll(query: JobQueryParams): Promise<JobDetail[]> {
    return this.jobRepository.findAll(query);
  }

  public async getById(id: string): Promise<JobDetail> {
    return this.jobRepository.findById(id);
  }

  public async getByCompanyId(companyId: string): Promise<JobDetail[]> {
    await this.companyRepository.findById(companyId);
    return this.jobRepository.findByCompanyId(companyId);
  }

  public async getByCategoryId(categoryId: string): Promise<JobDetail[]> {
    await this.categoryRepository.findById(categoryId);
    return this.jobRepository.findByCategoryId(categoryId);
  }

  public async update(id: string, requesterId: string, payload: UpdateJobPayload): Promise<Job> {
    await this.verifyOwnership(id, requesterId);
    if (payload.companyId !== undefined) {
      await this.companyRepository.findById(payload.companyId);
    }
    if (payload.categoryId !== undefined) {
      await this.categoryRepository.findById(payload.categoryId);
    }
    return this.jobRepository.update(id, payload);
  }

  public async delete(id: string, requesterId: string): Promise<void> {
    await this.verifyOwnership(id, requesterId);
    await this.jobRepository.delete(id);
  }

  private async verifyOwnership(jobId: string, requesterId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (job.postedBy !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak mengubah resource ini');
    }
  }
}
