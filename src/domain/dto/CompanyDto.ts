export interface CreateCompanyPayload {
  readonly name: string;
  readonly description?: string;
  readonly location?: string;
}

export interface UpdateCompanyPayload {
  readonly name?: string;
  readonly description?: string;
  readonly location?: string;
}
