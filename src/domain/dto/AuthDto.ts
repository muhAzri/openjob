import type { UserRole } from '../entities/User';

export interface RegisterUserPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role?: UserRole;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RefreshTokenPayload {
  readonly refreshToken: string;
}

export interface AccessTokenClaim {
  readonly id: string;
}

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}
