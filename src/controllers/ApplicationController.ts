import type { Request, Response } from 'express';
import type { ApplicationService } from '../services/ApplicationService';
import { requireUserId } from './RequestUser';

export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  public postApplication = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const application = await this.applicationService.apply(userId, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Lamaran berhasil ditambahkan',
      data: application,
    });
  };

  public getApplications = async (_req: Request, res: Response): Promise<void> => {
    const applications = await this.applicationService.getAll();
    res.status(200).json({
      status: 'success',
      data: { applications },
    });
  };

  public getApplicationById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const application = await this.applicationService.getById(id);
    res.status(200).json({
      status: 'success',
      data: application,
    });
  };

  public getApplicationsByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params['userId'] as string;
    const applications = await this.applicationService.getByUserId(userId);
    res.status(200).json({
      status: 'success',
      data: { applications },
    });
  };

  public getApplicationsByJob = async (req: Request, res: Response): Promise<void> => {
    const jobId = req.params['jobId'] as string;
    const applications = await this.applicationService.getByJobId(jobId);
    res.status(200).json({
      status: 'success',
      data: { applications },
    });
  };

  public putApplication = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    const application = await this.applicationService.updateStatus(id, requesterId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Status lamaran berhasil diperbarui',
      data: application,
    });
  };

  public deleteApplication = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    await this.applicationService.delete(id, requesterId);
    res.status(200).json({
      status: 'success',
      message: 'Lamaran berhasil dihapus',
    });
  };
}
