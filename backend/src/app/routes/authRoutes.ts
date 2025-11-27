import { Router } from 'express';
import { body } from 'express-validator';
import { login, signup } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validateRequest,
  signup
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validateRequest,
  login
);

export const authRoutes = router;

