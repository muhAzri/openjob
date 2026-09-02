export interface Company {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly location: string;
  readonly owner_id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export type CompanySummary = Omit<Company, 'updated_at'>;
