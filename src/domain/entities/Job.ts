export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Job {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly companyId: string;
  readonly categoryId: string;
  readonly postedBy: string;
  readonly location: string | null;
  readonly employmentType: EmploymentType;
  readonly salaryMin: number | null;
  readonly salaryMax: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface JobDetail extends Job {
  readonly companyName: string;
  readonly categoryName: string;
}
