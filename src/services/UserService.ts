import type { UserRepository } from '../repositories/UserRepository';
import type { PasswordHasher } from '../security/PasswordHasher';
import type { RegisterUserPayload, UpdateUserPayload } from '../domain/dto/AuthDto';
import { toSafeUser, type SafeUser } from '../domain/entities/User';
import { InvariantError } from '../errors';
import { CacheService } from './CacheService';
import { CacheKeys } from '../config/CacheKeys';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  public async register(payload: RegisterUserPayload): Promise<SafeUser> {
    const isEmailAvailable = await this.userRepository.isEmailAvailable(payload.email);
    if (!isEmailAvailable) {
      throw new InvariantError('Gagal menambahkan user. Email sudah digunakan');
    }

    const hashedPassword = await this.passwordHasher.hash(payload.password);
    const user = await this.userRepository.create(
      payload.name,
      payload.email,
      hashedPassword,
      payload.role ?? 'user',
    );
    return toSafeUser(user);
  }

  public async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    return toSafeUser(user);
  }

  public async update(id: string, payload: UpdateUserPayload): Promise<SafeUser> {
    if (payload.email !== undefined) {
      const isEmailAvailable = await this.userRepository.isEmailAvailableForUpdate(payload.email, id);
      if (!isEmailAvailable) {
        throw new InvariantError('Gagal memperbarui user. Email sudah digunakan');
      }
    }

    const user = await this.userRepository.update(id, payload);
    await CacheService.del(CacheKeys.userDetail(id));
    return toSafeUser(user);
  }
}
