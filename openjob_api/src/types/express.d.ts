import type { AccessTokenClaim } from '../domain/dto/AuthDto';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenClaim;
    }
  }
}

export {};
