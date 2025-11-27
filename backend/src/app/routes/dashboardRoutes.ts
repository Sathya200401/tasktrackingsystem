import { Router } from 'express';
import { getSummary } from '../controllers/dashboardController';

const router = Router();

router.get('/', getSummary);

export const dashboardRoutes = router;

