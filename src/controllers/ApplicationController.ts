import path from 'node:path';
import type { Request, Response } from 'express';
import type { ApplicationService } from '../services/ApplicationService';
import { requireUserId } from './RequestUser';
import { RESUME_UPLOAD_DIR } from '../middlewares/UploadMiddleware';
import { InvariantError } from '../errors';

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

  public postApplicationResume = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    if (req.file === undefined) {
      throw new InvariantError('Berkas resume wajib diunggah');
    }

    const application = await this.applicationService.uploadResume(
      id,
      requesterId,
      req.file.filename,
      req.file.originalname,
    );
    res.status(200).json({
      status: 'success',
      message: 'Resume berhasil diunggah',
      data: application,
    });
  };

  public getApplicationResume = async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id'] as string;
    const requesterId = requireUserId(req);
    const application = await this.applicationService.getResumeOwner(id, requesterId);

    if (application.resume_filename === null) {
      throw new InvariantError('Lamaran ini belum memiliki berkas resume');
    }

    const filePath = path.join(RESUME_UPLOAD_DIR, application.resume_filename);
    const downloadName = application.resume_original_name ?? application.resume_filename;
    res.download(filePath, downloadName);
  };
}
