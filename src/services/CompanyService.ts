import type { CompanyRepository } from '../repositories/CompanyRepository';
import type { Company } from '../domain/entities/Company';
import type { CreateCompanyPayload, UpdateCompanyPayload } from '../domain/dto/CompanyDto';
import { AuthorizationError } from '../errors';
import { CacheService } from './CacheService';
import { CacheKeys } from '../config/CacheKeys';

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async create(ownerId: string, payload: CreateCompanyPayload): Promise<Company> {
    const company = await this.companyRepository.create(ownerId, payload);
    await CacheService.del(CacheKeys.companyDetail(company.id));
    return company;
  }

  public async getAll(): Promise<Company[]> {
    return await this.companyRepository.findAll();
  }

  public async getById(id: string): Promise<Company> {
    return await this.companyRepository.findById(id);
  }

  public async update(
    id: string,
    ownerId: string,
    payload: UpdateCompanyPayload,
  ): Promise<Company> {
    await this.verifyOwnership(id, ownerId);
    const company = await this.companyRepository.update(id, payload);
    await CacheService.del(CacheKeys.companyDetail(id));
    return company;
  }

  public async delete(id: string, ownerId: string): Promise<void> {
    await this.verifyOwnership(id, ownerId);
    await this.companyRepository.delete(id);
    await CacheService.del(CacheKeys.companyDetail(id));
  }

  private async verifyOwnership(companyId: string, ownerId: string): Promise<void> {
    const company = await this.companyRepository.findById(companyId);
    if (company.owner_id !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengubah resource ini');
    }
  }
}
