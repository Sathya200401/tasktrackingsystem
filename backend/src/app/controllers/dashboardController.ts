import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getDashboardSummary } from '../../services/dashboardService';

export const getSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await getDashboardSummary();
  res.json({ success: true, data: summary });
});

