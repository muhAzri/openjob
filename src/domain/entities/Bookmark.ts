export interface Bookmark {
  readonly id: string;
  readonly job_id: string;
  readonly user_id: string;
  readonly created_at: Date;
}

export interface BookmarkDetail {
  readonly id: string;
  readonly user_id: string;
  readonly job_id: string;
  readonly title: string;
  readonly description: string | null;
  readonly company_id: string;
  readonly company_name: string;
  readonly category_id: string;
  readonly category_name: string;
  readonly job_type: string;
  readonly experience_level: string | null;
  readonly location_type: string | null;
  readonly location_city: string | null;
  readonly salary_min: number | null;
  readonly salary_max: number | null;
  readonly is_salary_visible: boolean;
  readonly status: string;
  readonly created_at: Date;
}
