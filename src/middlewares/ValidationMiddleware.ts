import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { InvariantError } from '../errors';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Validate<T> = (payload: unknown) => T;

export class ValidationMiddleware {
  public static validateBody<T>(validate: Validate<T>): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void => {
      try {
        req.body = validate(req.body);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public static validateQuery<T>(validate: Validate<T>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        res.locals['query'] = validate(req.query);
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public static validateUuidParam(paramName: string): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void => {
      const value = req.params[paramName];
      if (typeof value !== 'string' || !UUID_V4_REGEX.test(value)) {
        next(new InvariantError(`Parameter "${paramName}" harus berupa UUID yang valid`));
        return;
      }
      next();
    };
  }
}
