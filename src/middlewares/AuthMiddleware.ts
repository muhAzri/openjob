import type { NextFunction, Request, Response } from 'express';
import type { TokenManager } from '../security/TokenManager';
import { AuthenticationError } from '../errors';

export class AuthMiddleware {
  constructor(private readonly tokenManager: TokenManager) {}

  public authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const token = this.extractBearerToken(req.headers.authorization);
      req.user = this.tokenManager.verifyAccessToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };

  private extractBearerToken(authorizationHeader: string | undefined): string {
    if (authorizationHeader === undefined || !authorizationHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid Authorization header');
    }
    return authorizationHeader.substring('Bearer '.length);
  }
}
