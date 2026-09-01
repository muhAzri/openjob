import type { Request, Response } from 'express';
import type { BookmarkService } from '../services/BookmarkService';
import { requireUserId } from './RequestUser';

export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  public postBookmark = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const jobId = req.params['jobId'] as string;
    const bookmark = await this.bookmarkService.create(userId, jobId);
    res.status(201).json({
      status: 'success',
      message: 'Bookmark berhasil ditambahkan',
      data: { bookmark },
    });
  };

  public getBookmarkDetail = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const jobId = req.params['jobId'] as string;
    const id = req.params['id'] as string;
    const bookmark = await this.bookmarkService.getDetail(userId, jobId, id);
    res.status(200).json({
      status: 'success',
      data: { bookmark },
    });
  };

  public deleteBookmark = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const jobId = req.params['jobId'] as string;
    await this.bookmarkService.deleteByUserAndJob(userId, jobId);
    res.status(200).json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  };

  public getBookmarks = async (req: Request, res: Response): Promise<void> => {
    const userId = requireUserId(req);
    const bookmarks = await this.bookmarkService.getAllForUser(userId);
    res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  };
}
