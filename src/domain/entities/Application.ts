export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  readonly id: string;
  readonly job_id: string;
  readonly user_id: string;
  readonly cover_letter: string | null;
  readonly status: ApplicationStatus;
  readonly created_at: Date;
  readonly updated_at: Date;
}
