import type { NextFunction, Request, RequestHandler, Response } from 'express';

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
}
