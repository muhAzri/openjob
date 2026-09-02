export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  readonly id: string;
  readonly job_id: string;
  readonly user_id: string;
  readonly cover_letter: string | null;
  readonly status: ApplicationStatus;
  readonly resume_filename: string | null;
  readonly resume_original_name: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface ApplicationDetail extends Application {
  readonly job_title: string;
  readonly company_id: string;
  readonly company_name: string;
  readonly category_id: string;
}

export interface ApplicationProfileDetail extends ApplicationDetail {
  readonly category_name: string;
  readonly location_city: string | null;
}
