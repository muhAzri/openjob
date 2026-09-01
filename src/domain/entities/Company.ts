export interface Company {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly location: string | null;
  readonly ownerId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
