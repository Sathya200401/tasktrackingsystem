import type { Task, TaskPriority, TaskStatus } from '../types';
import { api } from './client';

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  employeeId?: string;
  search?: string;
}

export const getTasks = async (filters: TaskFilters): Promise<Task[]> => {
  const params: Record<string, string> = {};
  if (filters.status && filters.status !== 'all') params.status = filters.status;
  if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
  if (filters.employeeId) params.employeeId = filters.employeeId;
  if (filters.search) params.search = filters.search;

  const { data } = await api.get<{ success: boolean; data: Task[] }>('/api/tasks', { params });
  return data.data;
};

interface TaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
  milestone?: string;
  estimatedHours?: number;
  linkedDocs?: string[];
  assignedTo: string;
}

export const createTask = async (payload: TaskPayload) => {
  const { data } = await api.post('/api/tasks', payload);
  return data.data as Task;
};

export const updateTask = async (id: string, payload: Partial<TaskPayload>) => {
  const { data } = await api.put(`/api/tasks/${id}`, payload);
  return data.data as Task;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/api/tasks/${id}`);
};

