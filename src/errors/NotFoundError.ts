import { ClientError } from './ClientError';

export class NotFoundError extends ClientError {
  public readonly statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}
