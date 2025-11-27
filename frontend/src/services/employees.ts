import type { Employee } from '../types';
import { api } from './client';

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get<{ success: boolean; data: Employee[] }>('/api/employees');
  return data.data;
};

interface EmployeePayload {
  name: string;
  email: string;
  title?: string;
  department?: string;
  avatarUrl?: string;
  role?: 'admin' | 'member';
  location?: string;
  phone?: string;
  skills?: string[];
  allocation?: number;
  startDate?: string;
}

export const createEmployee = async (payload: EmployeePayload) => {
  const { data } = await api.post('/api/employees', payload);
  return data.data as Employee;
};

export const updateEmployee = async (id: string, payload: Partial<EmployeePayload>) => {
  const { data } = await api.put(`/api/employees/${id}`, payload);
  return data.data as Employee;
};

export const deleteEmployee = async (id: string) => {
  await api.delete(`/api/employees/${id}`);
};

