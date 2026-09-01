import type { BookmarkRepository } from '../repositories/BookmarkRepository';
import type { JobRepository } from '../repositories/JobRepository';
import type { Bookmark } from '../domain/entities/Bookmark';
import { AuthorizationError, InvariantError, NotFoundError } from '../errors';

export class BookmarkService {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  public async create(userId: string, jobId: string): Promise<Bookmark> {
    await this.jobRepository.findById(jobId);

    const alreadyBookmarked = await this.bookmarkRepository.exists(userId, jobId);
    if (alreadyBookmarked) {
      throw new InvariantError('Job ini sudah ada di bookmark Anda');
    }

    return this.bookmarkRepository.create(userId, jobId);
  }

  public async getDetail(userId: string, jobId: string, bookmarkId: string): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findById(bookmarkId);

    if (bookmark.job_id !== jobId) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
    if (bookmark.user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak melihat bookmark ini');
    }

    return bookmark;
  }

  public async getAllForUser(userId: string): Promise<Bookmark[]> {
    return this.bookmarkRepository.findByUserId(userId);
  }

  public async deleteByUserAndJob(userId: string, jobId: string): Promise<void> {
    await this.bookmarkRepository.deleteByUserAndJob(userId, jobId);
  }
}
