export type UserRole = 'user';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export type SafeUser = Omit<User, 'password'>;

export function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
