import type { Request } from 'express';
import { AuthenticationError } from '../errors';

export function requireUserId(req: Request): string {
  if (req.user === undefined) {
    throw new AuthenticationError('Anda harus login terlebih dahulu');
  }
  return req.user.id;
}
