export interface CreateCompanyPayload {
  readonly name: string;
  readonly location: string;
  readonly description?: string;
}

export interface UpdateCompanyPayload {
  readonly name?: string;
  readonly location?: string;
  readonly description?: string;
}
