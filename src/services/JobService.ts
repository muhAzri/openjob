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
    await this.companyRepository.findById(payload.company_id);
    await this.categoryRepository.findById(payload.category_id);
    return await this.jobRepository.create(postedBy, payload);
  }

  public async getAll(query: JobQueryParams): Promise<JobDetail[]> {
    return await this.jobRepository.findAll(query);
  }

  public async getById(id: string): Promise<JobDetail> {
    return await this.jobRepository.findById(id);
  }

  public async getByCompanyId(companyId: string): Promise<JobDetail[]> {
    return await this.jobRepository.findByCompanyId(companyId);
  }

  public async getByCategoryId(categoryId: string): Promise<JobDetail[]> {
    return await this.jobRepository.findByCategoryId(categoryId);
  }

  public async update(id: string, requesterId: string, payload: UpdateJobPayload): Promise<Job> {
    await this.verifyOwnership(id, requesterId);
    if (payload.company_id !== undefined) {
      await this.companyRepository.findById(payload.company_id);
    }
    if (payload.category_id !== undefined) {
      await this.categoryRepository.findById(payload.category_id);
    }
    return await this.jobRepository.update(id, payload);
  }

  public async delete(id: string, requesterId: string): Promise<void> {
    await this.verifyOwnership(id, requesterId);
    await this.jobRepository.delete(id);
  }

  private async verifyOwnership(jobId: string, requesterId: string): Promise<void> {
    const job = await this.jobRepository.findById(jobId);
    if (job.posted_by !== requesterId) {
      throw new AuthorizationError('Anda tidak berhak mengubah resource ini');
    }
  }
}
