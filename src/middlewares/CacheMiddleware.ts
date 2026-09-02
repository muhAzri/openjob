import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { CacheService } from '../services/CacheService';

type KeyResolver = (req: Request) => string;

export class CacheMiddleware {
  public static cache(resolveKey: KeyResolver): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = resolveKey(req);

      CacheService.get(key)
        .then((cached) => {
          if (cached !== null) {
            res.setHeader('X-Data-Source', 'cache');
            res.status(200).type('application/json').send(cached);
            return;
          }

          const originalJson = res.json.bind(res);
          res.json = (body: unknown): Response => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              CacheService.set(key, JSON.stringify(body)).catch(() => undefined);
            }
            return originalJson(body);
          };

          next();
        })
        .catch(next);
    };
  }
}
