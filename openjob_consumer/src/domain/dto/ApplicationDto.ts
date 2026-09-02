import type { ApplicationStatus } from '../entities/Application';

export interface CreateApplicationPayload {
  readonly user_id: string;
  readonly job_id: string;
  readonly cover_letter?: string;
  readonly status?: ApplicationStatus;
}

export interface UpdateApplicationPayload {
  readonly status: ApplicationStatus;
}
