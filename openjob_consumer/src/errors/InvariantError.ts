import { ClientError } from './ClientError';

export class InvariantError extends ClientError {
  public readonly statusCode = 400;
}
