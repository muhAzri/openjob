export class CacheKeys {
  public static companyDetail(id: string): string {
    return `company:${id}`;
  }

  public static userDetail(id: string): string {
    return `user:${id}`;
  }

  public static applicationDetail(id: string): string {
    return `application:${id}`;
  }

  public static applicationsByUser(userId: string): string {
    return `applications:user:${userId}`;
  }

  public static applicationsByJob(jobId: string): string {
    return `applications:job:${jobId}`;
  }

  public static bookmarksByUser(userId: string): string {
    return `bookmarks:user:${userId}`;
  }
}
