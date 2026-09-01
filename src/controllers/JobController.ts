import type { Request, Response } from 'express';
import type { JobService } from '../services/JobService';
import type { JobQueryParams } from '../domain/dto/JobDto';
import { requireUserId } from './RequestUser';

export class JobController {
  constructor(private readonly jobService: JobService) {}

  public postJob = async (req: Request, res: Response): Promise<void> => {
    const postedBy = requireUserId(req);
    const job = await this.jobService.create(postedBy, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Job berhasil ditambahkan',
      data: job,
    });
  };

  public getJobs = async (_req: Request, res: Response): Promise<void> => {
    const query = res.locals['query'] as JobQueryParams;
    const jobs = await this.jobService.getAll(query);
    res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  };

  public getJobById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const job = await this.jobService.getById(id);
    res.status(200).json({
      status: 'success',
      data: job,
    });
  };

  public getJobsByCompany = async (req: Request, res: Response): Promise<void> => {
    const companyId = req.params['companyId'] as string;
    const jobs = await this.jobService.getByCompanyId(companyId);
    res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  };

  public getJobsByCategory = async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params['categoryId'] as string;
    const jobs = await this.jobService.getByCategoryId(categoryId);
    res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  };

  public putJob = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    const job = await this.jobService.update(id, requesterId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Job berhasil diperbarui',
      data: job,
    });
  };

  public deleteJob = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    await this.jobService.delete(id, requesterId);
    res.status(200).json({
      status: 'success',
      message: 'Job berhasil dihapus',
    });
  };
}
