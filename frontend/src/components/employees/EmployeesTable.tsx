import {
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Employee } from '../../types';
import { deleteEmployee } from '../../services/employees';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { EditEmployeeDialog } from './EditEmployeeDialog';
import EmptyState from '../common/EmptyState';

interface Props {
  employees: Employee[];
}

export const EmployeesTable = ({ employees }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      showToast('Employee deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || 'Failed to delete employee. They may have assigned tasks.',
        'error'
      );
    },
  });

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete?.id) {
      deleteMutation.mutate(employeeToDelete.id);
    }
  };

  return (
    <>
      <Paper sx={{ borderRadius: 4, p: 2, overflowX: 'auto' }}>
        {employees.length === 0 ? (
          <EmptyState
            title="No employees"
            subtitle="Add team members to start assigning tasks"
            action={isAdmin ? { label: 'Add employee', onClick: () => {} } : undefined}
          />
        ) : (
          <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell align="center">Allocation</TableCell>
              <TableCell align="center">Tasks</TableCell>
              <TableCell align="center">Completion</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => {
              const total = employee.totalTasks ?? 0;
              const completed = employee.completedTasks ?? 0;
              const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
              return (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light' }}>{employee.name.charAt(0)}</Avatar>
                      <div>
                        <Typography fontWeight={600}>{employee.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.title}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                      {(employee.skills ?? []).slice(0, 3).map((skill) => (
                        <Chip key={skill} label={skill} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {employee.allocation ?? 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.role ?? 'member'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {completed}/{total}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" width={200}>
                    <LinearProgress variant="determinate" value={completionRate} sx={{ height: 8, borderRadius: 999 }} />
                    <Typography variant="caption" color="text.secondary">
                      {completionRate}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {isAdmin ? (
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(employee)}
                          title="Edit employee"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(employee)}
                          title="Delete employee"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Tooltip title="Admins only">
                        <span>
                          <IconButton size="small" color="primary" disabled title="Edit employee">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" disabled title="Delete employee" sx={{ ml: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        )}
      </Paper>

      {selectedEmployee && (
        <EditEmployeeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          employee={selectedEmployee}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

