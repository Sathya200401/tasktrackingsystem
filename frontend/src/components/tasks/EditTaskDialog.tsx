import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { updateTask } from '../../services/tasks';
import { useToast } from '../../context/ToastContext';
import type { Task, Employee, TaskStatus, TaskPriority } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  employees: Employee[];
  onSuccess: () => void;
}

const statusOptions = [
  { value: 'todo' as TaskStatus, label: 'Backlog' },
  { value: 'in_progress' as TaskStatus, label: 'In Progress' },
  { value: 'in_review' as TaskStatus, label: 'In Review' },
  { value: 'testing' as TaskStatus, label: 'Testing' },
  { value: 'need_review' as TaskStatus, label: 'Need Review' },
  { value: 'done' as TaskStatus, label: 'Done' },
];

const priorityOptions = [
  { value: 'low' as TaskPriority, label: 'Low' },
  { value: 'medium' as TaskPriority, label: 'Medium' },
  { value: 'high' as TaskPriority, label: 'High' },
  { value: 'critical' as TaskPriority, label: 'Critical' },
];

export const EditTaskDialog = ({ open, onClose, task, employees, onSuccess }: Props) => {
  const { showToast } = useToast();
  const [form, setForm] = useState<Partial<Task>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags || [],
        milestone: task.milestone,
        estimatedHours: task.estimatedHours,
        assignedTo: task.assignedTo,
      });
    }
  }, [task, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!task?.id) return;
      return updateTask(task.id, {
        title: form.title as string,
        description: form.description,
        status: form.status as TaskStatus,
        priority: form.priority as TaskPriority,
        dueDate: form.dueDate,
        tags: form.tags,
        milestone: form.milestone,
        estimatedHours: form.estimatedHours,
        assignedTo: typeof form.assignedTo === 'object' && form.assignedTo?.id ? form.assignedTo.id : '',
      });
    },
    onSuccess: () => {
      showToast('Task updated successfully', 'success');
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to update task', 'error');
    },
  });

  const handleChange = (field: string) => (event: any) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setForm((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (!form.title?.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    mutation.mutate();
  };

  const assignedEmployee = typeof form.assignedTo === 'object' ? form.assignedTo : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            fullWidth
            value={form.title || ''}
            onChange={handleChange('title')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={form.description || ''}
            onChange={handleChange('description')}
            disabled={mutation.isPending}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status || 'todo'}
              onChange={handleChange('status')}
              label="Status"
              disabled={mutation.isPending}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={form.priority || 'medium'}
              onChange={handleChange('priority')}
              label="Priority"
              disabled={mutation.isPending}
            >
              {priorityOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={assignedEmployee?.id || ''}
              onChange={(e) => {
                const emp = employees.find((employee) => employee.id === e.target.value);
                setForm((prev) => ({ ...prev, assignedTo: emp }));
              }}
              label="Assigned To"
              disabled={mutation.isPending}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={form.dueDate || ''}
            onChange={handleChange('dueDate')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Estimated Hours"
            type="number"
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
            value={form.estimatedHours || ''}
            onChange={handleChange('estimatedHours')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Milestone"
            fullWidth
            value={form.milestone || ''}
            onChange={handleChange('milestone')}
            disabled={mutation.isPending}
          />
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                label="Add Tag"
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                disabled={mutation.isPending}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddTag} variant="outlined" disabled={mutation.isPending}>
                Add
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
              {(form.tags || []).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  disabled={mutation.isPending}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={mutation.isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
