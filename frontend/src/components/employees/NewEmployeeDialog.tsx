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

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
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
  }) => void;
  isSubmitting: boolean;
}

const defaultState = {
  name: '',
  email: '',
  title: '',
  department: '',
  avatarUrl: '',
  role: 'member',
  location: '',
  phone: '',
  allocation: '',
  startDate: '',
  skillsText: '',
};

export const NewEmployeeDialog = ({ open, onClose, onCreate, isSubmitting }: Props) => {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (open) {
      setForm(defaultState);
    }
  }, [open]);

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onCreate({
      name: form.name,
      email: form.email,
      title: form.title || undefined,
      department: form.department || undefined,
      avatarUrl: form.avatarUrl || undefined,
      role: form.role as 'admin' | 'member',
      location: form.location || undefined,
      phone: form.phone || undefined,
      allocation: form.allocation ? Number(form.allocation) : undefined,
      startDate: form.startDate || undefined,
      skills: form.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="new-employee-dialog-title">
      <DialogTitle id="new-employee-dialog-title">Add Employee</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField label="Full name" value={form.name} onChange={handleChange('name')} required autoFocus />
          <TextField label="Email" type="email" value={form.email} onChange={handleChange('email')} required />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Title" value={form.title} onChange={handleChange('title')} fullWidth />
            <TextField label="Department" value={form.department} onChange={handleChange('department')} fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              fullWidth
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField label="Location" value={form.location} onChange={handleChange('location')} fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth />
            <TextField
              label="Allocation %"
              type="number"
              value={form.allocation}
              onChange={handleChange('allocation')}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Avatar URL" value={form.avatarUrl} onChange={handleChange('avatarUrl')} fullWidth />
            <TextField
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={handleChange('startDate')}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
          <TextField
            label="Skills"
            placeholder="react, leadership, analytics"
            value={form.skillsText}
            onChange={handleChange('skillsText')}
            helperText="Separate values with commas"
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !form.name || !form.email}>
          {isSubmitting ? 'Saving...' : 'Add employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};


