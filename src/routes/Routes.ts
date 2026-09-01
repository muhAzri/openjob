import type { Router } from 'express';

export interface Routes {
  register(): Router;
}
