import type { UserRepository } from '../repositories/UserRepository';
import type { PasswordHasher } from '../security/PasswordHasher';
import type { RegisterUserPayload } from '../domain/dto/AuthDto';
import { toSafeUser, type SafeUser } from '../domain/entities/User';
import { InvariantError } from '../errors';

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
    const user = await this.userRepository.create(payload.fullname, payload.email, hashedPassword);
    return toSafeUser(user);
  }

  public async getById(id: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(id);
    return toSafeUser(user);
  }
}
