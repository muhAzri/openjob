export interface RegisterUserPayload {
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
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
