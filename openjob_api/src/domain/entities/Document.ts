export interface DocumentRecord {
  readonly id: string;
  readonly user_id: string;
  readonly filename: string;
  readonly original_name: string;
  readonly size: number;
  readonly mime_type: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}
