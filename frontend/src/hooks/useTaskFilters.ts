import { useState } from 'react';
import type { TaskFilters as TaskFiltersType } from '../services/tasks';

const defaultFilters: TaskFiltersType = {
  status: 'all',
  priority: 'all',
};

export const useTaskFilters = () => {
  const [filters, setFilters] = useState<TaskFiltersType>(defaultFilters);

  const updateFilters = (nextFilters: Partial<TaskFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...nextFilters }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return { filters, updateFilters, resetFilters };
};

