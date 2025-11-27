import { NextFunction, Request, Response, RequestHandler } from 'express';

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void): RequestHandler =>
  async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };

