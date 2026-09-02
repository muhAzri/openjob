import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import type { AccessTokenClaim } from '../domain/dto/AuthDto';
import { AuthenticationError, InvariantError } from '../errors';

function isAccessTokenClaim(payload: unknown): payload is AccessTokenClaim {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof (payload as Record<string, unknown>)['id'] === 'string'
  );
}

export class TokenManager {
  constructor(
    private readonly accessTokenKey: string,
    private readonly refreshTokenKey: string,
    private readonly accessTokenAgeInSeconds: number,
  ) {}

  public generateAccessToken(claim: AccessTokenClaim): string {
    return jwt.sign(claim, this.accessTokenKey, { expiresIn: this.accessTokenAgeInSeconds });
  }

  public generateRefreshToken(claim: AccessTokenClaim): string {
    return jwt.sign(claim, this.refreshTokenKey, { jwtid: randomUUID() });
  }

  public verifyAccessToken(token: string): AccessTokenClaim {
    try {
      const decoded = jwt.verify(token, this.accessTokenKey);
      if (!isAccessTokenClaim(decoded)) {
        throw new AuthenticationError('Access token payload tidak valid');
      }
      return decoded;
    } catch {
      throw new AuthenticationError('Access token tidak valid atau kedaluwarsa');
    }
  }

  public verifyRefreshToken(token: string): AccessTokenClaim {
    try {
      const decoded = jwt.verify(token, this.refreshTokenKey);
      if (!isAccessTokenClaim(decoded)) {
        throw new InvariantError('Refresh token payload tidak valid');
      }
      return decoded;
    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}
