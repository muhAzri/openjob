import type { Request, Response } from 'express';
import type { ProfileService } from '../services/ProfileService';
import { requireUserId } from './RequestUser';

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const user = await this.profileService.getProfile(userId);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  };

  public getMyApplications = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const applications = await this.profileService.getApplications(userId);
    res.status(200).json({
      status: 'success',
      data: { applications },
    });
  };

  public getMyBookmarks = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const bookmarks = await this.profileService.getBookmarks(userId);
    res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  };
}
