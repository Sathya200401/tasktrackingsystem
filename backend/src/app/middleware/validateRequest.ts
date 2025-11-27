import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../../utils/ApiError';

export const validateRequest = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: 'param' in error ? error.param : undefined,
      message: error.msg,
      value: 'value' in error ? error.value : undefined,
    }));
    return next(new ApiError(422, 'Validation failed', details));
  }
  return next();
};

