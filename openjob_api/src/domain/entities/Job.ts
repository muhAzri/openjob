export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Job {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly company_id: string;
  readonly category_id: string;
  readonly posted_by: string;
  readonly job_type: JobType;
  readonly experience_level: string | null;
  readonly location_type: string | null;
  readonly location_city: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly is_salary_visible: boolean;
  readonly status: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface JobDetail extends Job {
  readonly company_name: string;
  readonly category_name: string;
}

export interface JobSummary {
  readonly id: string;
  readonly title: string;
  readonly company_id: string;
  readonly company_name: string;
  readonly category_id: string;
  readonly category_name: string;
  readonly job_type: JobType;
  readonly location_type: string | null;
  readonly location_city: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly is_salary_visible: boolean;
  readonly status: string;
}
