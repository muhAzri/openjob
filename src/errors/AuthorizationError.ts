import { ClientError } from './ClientError';

export class AuthorizationError extends ClientError {
  public readonly statusCode = 403;

  constructor(message: string) {
    super(message);
  }
}
