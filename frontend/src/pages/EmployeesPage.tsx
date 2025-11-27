import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, getEmployees } from '../services/employees';
import { EmployeesTable } from '../components/employees/EmployeesTable';
import { NewEmployeeDialog } from '../components/employees/NewEmployeeDialog';
import { useAuth } from '../context/AuthContext';

export const EmployeesPage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setOpen(false);
    },
  });

  const handleCreate = (payload: Parameters<typeof createEmployee>[0]) => {
    createMutation.mutate(payload);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h4" fontWeight={700}>
            People Ops
          </Typography>
          <Typography color="text.secondary">See ownership, focus areas, and utilization at a glance.</Typography>
          {!isAdmin && (
            <Typography variant="caption" color="text.secondary">
              You currently have read-only access.
            </Typography>
          )}
        </div>
        <Button startIcon={<PersonAddAltIcon />} onClick={() => setOpen(true)} disabled={!isAdmin}>
          Add Employee
        </Button>
      </Stack>

      <EmployeesTable employees={employees} />

      <NewEmployeeDialog open={isAdmin && open} onClose={() => setOpen(false)} onCreate={handleCreate} isSubmitting={createMutation.isPending} />
    </Stack>
  );
};

