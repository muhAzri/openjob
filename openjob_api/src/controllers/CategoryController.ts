import type { Request, Response } from 'express';
import type { CategoryService } from '../services/CategoryService';
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../domain/dto/CategoryDto';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  public postCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.create(req.body as CreateCategoryPayload);
    res.status(201).json({
      status: 'success',
      message: 'Category berhasil ditambahkan',
      data: category,
    });
  };

  public getCategories = async (_req: Request, res: Response): Promise<void> => {
    const categories = await this.categoryService.getAll();
    res.status(200).json({
      status: 'success',
      data: { categories },
    });
  };

  public getCategoryById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const category = await this.categoryService.getById(id);
    res.status(200).json({
      status: 'success',
      data: category,
    });
  };

  public putCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const category = await this.categoryService.update(id, req.body as UpdateCategoryPayload);
    res.status(200).json({
      status: 'success',
      message: 'Category berhasil diperbarui',
      data: category,
    });
  };

  public deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    await this.categoryService.delete(id);
    res.status(200).json({
      status: 'success',
      message: 'Category berhasil dihapus',
    });
  };
}
