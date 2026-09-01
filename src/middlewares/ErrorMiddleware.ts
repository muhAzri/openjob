import type { NextFunction, Request, Response } from 'express';
import { ClientError } from '../errors';

export class ErrorMiddleware {
  public static routeNotFound = (req: Request, res: Response): void => {
    res.status(404).json({
      status: 'failed',
      message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
    });
  };

  public static handle = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    if (error instanceof ClientError) {
      res.status(error.statusCode).json({
        status: 'failed',
        message: error.message,
      });
      return;
    }

    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({
        status: 'failed',
        message: 'Request body bukan JSON yang valid',
      });
      return;
    }

    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami',
    });
  };
}
