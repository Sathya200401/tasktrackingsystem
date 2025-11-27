import { Router } from 'express';
import { body } from 'express-validator';
import { createEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from '../controllers/employeeController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

const optionalEmployeeFields = [
  body('role').optional().isIn(['admin', 'member']),
  body('title').optional().isString(),
  body('department').optional().isString(),
  body('avatarUrl').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('phone').optional().isString(),
  body('location').optional().isString(),
  body('skills').optional().isArray(),
  body('skills.*').optional().isString(),
  body('allocation').optional().isFloat({ min: 0, max: 100 }),
  body('startDate').optional().isISO8601(),
];

const createValidators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  ...optionalEmployeeFields,
];

const updateValidators = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  ...optionalEmployeeFields,
];

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authenticate, requireAdmin, createValidators, validateRequest, createEmployee);
router.put('/:id', authenticate, requireAdmin, updateValidators, validateRequest, updateEmployee);
router.delete('/:id', authenticate, requireAdmin, deleteEmployee);

export const employeeRoutes = router;

