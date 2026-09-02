import type { JobType } from '../entities/Job';

export interface CreateJobPayload {
  readonly title: string;
  readonly description?: string;
  readonly company_id: string;
  readonly category_id: string;
  readonly job_type?: JobType;
  readonly experience_level?: string;
  readonly location_type?: string;
  readonly location_city?: string;
  readonly salary_min?: number;
  readonly salary_max?: number;
  readonly is_salary_visible?: boolean;
  readonly status?: string;
}

export interface UpdateJobPayload {
  readonly title?: string;
  readonly description?: string;
  readonly company_id?: string;
  readonly category_id?: string;
  readonly job_type?: JobType;
  readonly experience_level?: string;
  readonly location_type?: string;
  readonly location_city?: string;
  readonly salary_min?: number;
  readonly salary_max?: number;
  readonly is_salary_visible?: boolean;
  readonly status?: string;
}

export interface JobQueryParams {
  readonly title?: string;
  readonly companyName?: string;
}
