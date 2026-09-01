import type { ApplicationStatus } from '../entities/Application';

export interface CreateApplicationPayload {
  readonly jobId: string;
  readonly coverLetter?: string;
}

export interface UpdateApplicationPayload {
  readonly status: ApplicationStatus;
}
