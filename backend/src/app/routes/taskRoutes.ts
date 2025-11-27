import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const statusEnum = ['todo', 'in_progress', 'in_review', 'testing', 'need_review', 'done'];
const priorityEnum = ['low', 'medium', 'high', 'critical'];

router.get(
  '/',
  [
    query('status').optional().isIn(statusEnum),
    query('priority').optional().isIn(priorityEnum),
    query('employeeId').optional().isMongoId(),
  ],
  validateRequest,
  getTasks
);

router.get('/:id', [param('id').isMongoId()], validateRequest, getTaskById);

const createTaskValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('assignedTo').isMongoId().withMessage('Valid employee id is required'),
  body('status').optional().isIn(statusEnum),
  body('priority').optional().isIn(priorityEnum),
  body('dueDate').optional().isISO8601(),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString(),
  body('description').optional().isString(),
  body('milestone').optional().isString(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('linkedDocs').optional().isArray(),
  body('linkedDocs.*').optional().isURL(),
];

const updateTaskValidators = [
  param('id').isMongoId(),
  body('title').optional().trim().notEmpty(),
  body('assignedTo').optional().isMongoId(),
  body('status').optional().isIn(statusEnum),
  body('priority').optional().isIn(priorityEnum),
  body('dueDate').optional().isISO8601(),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString(),
  body('description').optional().isString(),
  body('milestone').optional().isString(),
  body('estimatedHours').optional().isFloat({ min: 0 }),
  body('linkedDocs').optional().isArray(),
  body('linkedDocs.*').optional().isURL(),
];

router.post('/', authenticate, requireAdmin, createTaskValidators, validateRequest, createTask);
router.put('/:id', authenticate, requireAdmin, updateTaskValidators, validateRequest, updateTask);
router.delete('/:id', authenticate, requireAdmin, [param('id').isMongoId()], validateRequest, deleteTask);

export const taskRoutes = router;

