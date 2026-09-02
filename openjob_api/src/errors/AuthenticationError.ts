import { ClientError } from './ClientError';

export class AuthenticationError extends ClientError {
  public readonly statusCode = 401;
}
