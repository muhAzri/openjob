import bcrypt from 'bcrypt';

export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  public async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, PasswordHasher.SALT_ROUNDS);
  }

  public async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
