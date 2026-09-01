export interface User {
  readonly id: string;
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;

export function toSafeUser(user: User): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}
