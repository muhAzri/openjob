import type { NextFunction, Request, Response } from 'express';
import { ClientError } from '../errors';

export class ErrorMiddleware {
  public static routeNotFound = (req: Request, res: Response): void => {
    res.status(404).json({
      status: 'fail',
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
        status: 'fail',
        message: error.message,
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
