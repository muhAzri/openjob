import type { CompanyRepository } from '../repositories/CompanyRepository';
import type { Company } from '../domain/entities/Company';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '../domain/dto/CompanyDto';
import { AuthorizationError } from '../errors';

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async create(ownerId: string, payload: CreateCompanyPayload): Promise<Company> {
    return this.companyRepository.create(ownerId, payload);
  }

  public async getAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  public async getById(id: string): Promise<Company> {
    return this.companyRepository.findById(id);
  }

  public async update(id: string, ownerId: string, payload: UpdateCompanyPayload): Promise<Company> {
    await this.verifyOwnership(id, ownerId);
    return this.companyRepository.update(id, payload);
  }

  public async delete(id: string, ownerId: string): Promise<void> {
    await this.verifyOwnership(id, ownerId);
    await this.companyRepository.delete(id);
  }

  private async verifyOwnership(companyId: string, ownerId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (company.owner_id !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengubah resource ini');
    }
  }
}
