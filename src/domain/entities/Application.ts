export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface Application {
  readonly id: string;
  readonly jobId: string;
  readonly userId: string;
  readonly coverLetter: string | null;
  readonly status: ApplicationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
