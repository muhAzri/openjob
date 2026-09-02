import type { CategoryRepository } from '../repositories/CategoryRepository';
import type { Category } from '../domain/entities/Category';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../domain/dto/CategoryDto';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async create(payload: CreateCategoryPayload): Promise<Category> {
    return await this.categoryRepository.create(payload);
  }

  public async getAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  public async getById(id: string): Promise<Category> {
    return await this.categoryRepository.findById(id);
  }

  public async update(id: string, payload: UpdateCategoryPayload): Promise<Category> {
    return await this.categoryRepository.update(id, payload);
  }

  public async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
