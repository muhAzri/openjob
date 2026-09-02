import { ClientError } from './ClientError';

export class AuthorizationError extends ClientError {
  public readonly statusCode = 403;
}
