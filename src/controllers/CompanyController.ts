import type { Request, Response } from 'express';
import type { CompanyService } from '../services/CompanyService';
import { requireUserId } from './RequestUser';

export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  public postCompany = async (req: Request, res: Response): Promise<void> => {
    const ownerId = requireUserId(req);
    const company = await this.companyService.create(ownerId, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Company berhasil ditambahkan',
      data: company,
    });
  };

  public getCompanies = async (_req: Request, res: Response): Promise<void> => {
    const companies = await this.companyService.getAll();
    res.status(200).json({
      status: 'success',
      data: { companies },
    });
  };

  public getCompanyById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const company = await this.companyService.getById(id);
    res.status(200).json({
      status: 'success',
      data: company,
    });
  };

  public putCompany = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const ownerId = requireUserId(req);
    const company = await this.companyService.update(id, ownerId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Company berhasil diperbarui',
      data: company,
    });
  };

  public deleteCompany = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const ownerId = requireUserId(req);
    await this.companyService.delete(id, ownerId);
    res.status(200).json({
      status: 'success',
      message: 'Company berhasil dihapus',
    });
  };
}
