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
import { updateEmployee } from '../../services/employees';
import { useToast } from '../../context/ToastContext';
import type { Employee } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSuccess: () => void;
}

export const EditEmployeeDialog = ({ open, onClose, employee, onSuccess }: Props) => {
  const { showToast } = useToast();
  const [form, setForm] = useState<Partial<Employee>>({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        title: employee.title,
        department: employee.department,
        phone: employee.phone,
        location: employee.location,
        skills: employee.skills || [],
        allocation: employee.allocation,
        role: employee.role,
      });
    }
  }, [employee, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!employee?.id) return;
      return updateEmployee(employee.id, form);
    },
    onSuccess: () => {
      showToast('Employee updated successfully', 'success');
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to update employee', 'error');
    },
  });

  const handleChange = (field: string) => (event: any) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setForm((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skill),
    }));
  };

  const handleSubmit = () => {
    if (!form.name?.trim() || !form.email?.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="edit-employee-dialog-title">
      <DialogTitle id="edit-employee-dialog-title">Edit Employee</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            value={form.name || ''}
            onChange={handleChange('name')}
            disabled={mutation.isPending}
            autoFocus
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={form.email || ''}
            onChange={handleChange('email')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Title"
            fullWidth
            value={form.title || ''}
            onChange={handleChange('title')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Department"
            fullWidth
            value={form.department || ''}
            onChange={handleChange('department')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Phone"
            fullWidth
            value={form.phone || ''}
            onChange={handleChange('phone')}
            disabled={mutation.isPending}
          />
          <TextField
            label="Location"
            fullWidth
            value={form.location || ''}
            onChange={handleChange('location')}
            disabled={mutation.isPending}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role || 'member'}
              onChange={handleChange('role')}
              label="Role"
              disabled={mutation.isPending}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Allocation %"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            fullWidth
            value={form.allocation || 0}
            onChange={handleChange('allocation')}
            disabled={mutation.isPending}
          />
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                label="Add Skill"
                size="small"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                disabled={mutation.isPending}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill();
                  }
                }}
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddSkill} variant="outlined" disabled={mutation.isPending}>
                Add
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
              {(form.skills || []).map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
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
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending} loading={mutation.isPending}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
