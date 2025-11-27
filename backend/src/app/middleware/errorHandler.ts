import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

export const errorHandler = (err: Error | ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  const code = err instanceof ApiError ? getErrorCode(status) : 'INTERNAL_SERVER_ERROR';
  const timestamp = new Date().toISOString();

  const response: any = {
    success: false,
    error: {
      code,
      message,
      timestamp,
    },
  };

  if (err instanceof ApiError && err.details) {
    response.error.details = err.details;
  }

  if (process.env.NODE_ENV === 'development' && !(err instanceof ApiError)) {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};

function getErrorCode(status: number): string {
  const codeMap: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  };
  return codeMap[status] || 'ERROR';
}

