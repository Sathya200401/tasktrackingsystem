import type { DashboardSummary } from '../types';
import { api } from './client';

export const getDashboard = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<{ success: boolean; data: DashboardSummary }>('/api/dashboard');
  return data.data;
};

