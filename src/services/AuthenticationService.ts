import type { UserRepository } from '../repositories/UserRepository';
import type { AuthenticationRepository } from '../repositories/AuthenticationRepository';
import type { PasswordHasher } from '../security/PasswordHasher';
import type { TokenManager } from '../security/TokenManager';
import type { LoginPayload, TokenPair } from '../domain/dto/AuthDto';
import { AuthenticationError, NotFoundError } from '../errors';

export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenManager: TokenManager,
  ) {}

  public async login(payload: LoginPayload): Promise<TokenPair> {
    const user = await this.userRepository.findByEmail(payload.email).catch((error: unknown) => {
      if (error instanceof NotFoundError) {
        throw new AuthenticationError('Kredensial yang Anda berikan salah');
      }
      throw error;
    });

    const isPasswordMatch = await this.passwordHasher.compare(payload.password, user.password);
    if (!isPasswordMatch) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const claim = { id: user.id };
    const accessToken = this.tokenManager.generateAccessToken(claim);
    const refreshToken = this.tokenManager.generateRefreshToken(claim);

    await this.authenticationRepository.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }

  public async refreshAccessToken(refreshToken: string): Promise<string> {
    const claim = this.tokenManager.verifyRefreshToken(refreshToken);
    await this.authenticationRepository.verifyRefreshTokenExists(refreshToken);
    return this.tokenManager.generateAccessToken({ id: claim.id });
  }

  public async logout(refreshToken: string): Promise<void> {
    await this.authenticationRepository.verifyRefreshTokenExists(refreshToken);
    await this.authenticationRepository.deleteRefreshToken(refreshToken);
  }
}
