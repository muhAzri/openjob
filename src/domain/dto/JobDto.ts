import type { EmploymentType } from '../entities/Job';

export interface CreateJobPayload {
  readonly title: string;
  readonly description?: string;
  readonly companyId: string;
  readonly categoryId: string;
  readonly location?: string;
  readonly employmentType?: EmploymentType;
  readonly salaryMin?: number;
  readonly salaryMax?: number;
}

export interface UpdateJobPayload {
  readonly title?: string;
  readonly description?: string;
  readonly companyId?: string;
  readonly categoryId?: string;
  readonly location?: string;
  readonly employmentType?: EmploymentType;
  readonly salaryMin?: number;
  readonly salaryMax?: number;
}

export interface JobQueryParams {
  readonly title?: string;
  readonly companyName?: string;
}
