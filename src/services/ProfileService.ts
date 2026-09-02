import type { UserRepository } from '../repositories/UserRepository';
import type { ApplicationRepository } from '../repositories/ApplicationRepository';
import type { BookmarkRepository } from '../repositories/BookmarkRepository';
import type { Application } from '../domain/entities/Application';
import type { Bookmark } from '../domain/entities/Bookmark';
import { toSafeUser, type SafeUser } from '../domain/entities/User';

export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly bookmarkRepository: BookmarkRepository,
  ) {}

  public async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId);
    return toSafeUser(user);
  }

  public async getApplications(userId: string): Promise<Application[]> {
    return await this.applicationRepository.findByUserId(userId);
  }

  public async getBookmarks(userId: string): Promise<Bookmark[]> {
    return await this.bookmarkRepository.findByUserId(userId);
  }
}
