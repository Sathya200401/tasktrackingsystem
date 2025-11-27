import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import type { Employee, TaskPriority, TaskStatus } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
  onCreate: (payload: {
    title: string;
    description?: string;
    assignedTo: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string;
    tags: string[];
  }) => void;
  isSubmitting: boolean;
}

const defaultState = {
  title: '',
  description: '',
  assignedTo: '',
  priority: 'medium' as TaskPriority,
  status: 'todo' as TaskStatus,
  dueDate: '',
  tagsText: '',
  milestone: '',
  estimatedHours: '',
  linkedDocsText: '',
};

export const NewTaskDialog = ({ open, onClose, employees, onCreate, isSubmitting }: Props) => {
  const [form, setForm] = useState(defaultState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm((prev) => ({
        ...defaultState,
        assignedTo: employees[0]?.id ?? prev.assignedTo,
      }));
    }
  }, [open, employees]);

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title || !form.title.trim()) newErrors.title = 'Title is required';
    if (!form.assignedTo) newErrors.assignedTo = 'Assignee is required';
    if (form.estimatedHours) {
      const n = Number(form.estimatedHours);
      if (Number.isNaN(n) || n < 0) newErrors.estimatedHours = 'Enter a valid non-negative number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const payload = {
      title: form.title,
      description: form.description || undefined,
      assignedTo: form.assignedTo,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      tags: form.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      milestone: form.milestone || undefined,
      estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : undefined,
      linkedDocs: form.linkedDocsText
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean),
    };
    onCreate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField 
            label="Title" 
            value={form.title} 
            onChange={handleChange('title')} 
            error={!!errors.title}
            helperText={errors.title}
            required 
            fullWidth 
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            fullWidth
            multiline
            minRows={3}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Assignee"
              value={form.assignedTo}
              onChange={handleChange('assignedTo')}
              fullWidth
              required
              error={!!errors.assignedTo}
              helperText={errors.assignedTo}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Status" value={form.status} onChange={handleChange('status')} fullWidth>
              <MenuItem value="todo">Backlog</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="in_review">In Review</MenuItem>
              <MenuItem value="testing">Testing</MenuItem>
              <MenuItem value="need_review">Need Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField select label="Priority" value={form.priority} onChange={handleChange('priority')} fullWidth>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              type="date"
              label="Due date"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={handleChange('dueDate')}
              fullWidth
            />
          </Stack>
          <TextField
            label="Tags"
            placeholder="design, frontend"
            value={form.tagsText}
            onChange={handleChange('tagsText')}
            helperText="Separate tags with commas"
            fullWidth
          />
          <TextField label="Milestone / Initiative" value={form.milestone} onChange={handleChange('milestone')} fullWidth />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Estimated hours"
              type="number"
              value={form.estimatedHours}
              onChange={handleChange('estimatedHours')}
              inputProps={{ min: 0, step: 0.5 }}
              fullWidth
              error={!!errors.estimatedHours}
              helperText={errors.estimatedHours}
            />
            <TextField
              label="Reference links"
              placeholder="https://doc.one, https://figma.com/file"
              value={form.linkedDocsText}
              onChange={handleChange('linkedDocsText')}
              helperText="Comma separated URLs"
              fullWidth
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !form.title || !form.assignedTo}>
          {isSubmitting ? 'Creating...' : 'Create task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

