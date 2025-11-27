import { Button, MenuItem, Paper, Stack, TextField } from '@mui/material';
import type { TaskFilters as TaskFiltersType } from '../../services/tasks';
import type { Employee, TaskPriority, TaskStatus } from '../../types';

interface Props {
  filters: TaskFiltersType;
  onChange: (filters: Partial<TaskFiltersType>) => void;
  onReset: () => void;
  employees: Employee[];
}

const statusOptions: Array<{ value: TaskStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'testing', label: 'Testing' },
  { value: 'need_review', label: 'Need Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
  { value: 'all', label: 'All priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const TaskFiltersPanel = ({ filters, onChange, onReset, employees }: Props) => (
  <Paper sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
      <TextField
        select
        label="Status"
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ status: e.target.value as TaskStatus | 'all' })}
        fullWidth
        sx={{ flex: 1 }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Priority"
        value={filters.priority ?? 'all'}
        onChange={(e) => onChange({ priority: e.target.value as TaskPriority | 'all' })}
        fullWidth
        sx={{ flex: 1 }}
      >
        {priorityOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Assignee"
        value={filters.employeeId ?? ''}
        onChange={(e) => onChange({ employeeId: e.target.value || undefined })}
        fullWidth
        sx={{ flex: 1 }}
      >
        <MenuItem value="">All employees</MenuItem>
        {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Search"
        placeholder="Title or tag"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value })}
        fullWidth
        sx={{ flex: 1 }}
      />

      <Button variant="outlined" onClick={onReset} fullWidth sx={{ whiteSpace: 'nowrap', flex: 1 }}>
        Reset
      </Button>
    </Stack>
  </Paper>
);

