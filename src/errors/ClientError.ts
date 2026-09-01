export abstract class ClientError extends Error {
  public abstract readonly statusCode: number;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
