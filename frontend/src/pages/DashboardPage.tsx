import { useState } from 'react';
import { Box, Button, Chip, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboard } from '../services/dashboard';
import { getEmployees } from '../services/employees';
import { createTask } from '../services/tasks';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TeamLoad } from '../components/dashboard/TeamLoad';
import { NewTaskDialog } from '../components/tasks/NewTaskDialog';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const queryClient = useQueryClient();
  const [isTaskDialogOpen, setTaskDialogOpen] = useState(false);
  const { data: summary, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });
  const { isAdmin } = useAuth();
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTaskDialogOpen(false);
    },
  });

  const handleCreateTask = (payload: Parameters<typeof createTask>[0]) => {
    createTaskMutation.mutate(payload);
  };

  if (isLoading || !summary) {
    return <Skeleton variant="rounded" height={400} />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h4" fontWeight={700}>
            Mission Control
          </Typography>
          <Typography color="text.secondary">Monitor delivery health and unblock your teams faster.</Typography>
          {!isAdmin && (
            <Typography variant="caption" color="text.secondary">
              You can explore insights but editing is limited to admins.
            </Typography>
          )}
        </div>
        <Button startIcon={<AddTaskIcon />} size="large" onClick={() => setTaskDialogOpen(true)} disabled={!employees.length || !isAdmin}>
          Log update
        </Button>
      </Stack>

      <KpiGrid totals={summary.totals} />

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{ xs: 'repeat(1, minmax(0, 1fr))', md: '2fr 1fr' }}
      >
        <StatusDistribution distribution={summary.distribution} />
        <TeamLoad employees={employees} />
      </Box>

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{ xs: 'repeat(1, minmax(0, 1fr))', md: 'repeat(2, minmax(0, 1fr))' }}
      >
        <RecentActivity tasks={summary.recentActivities} />
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Delivery Insights</Typography>
            <Typography variant="body2" color="text.secondary">
              Top initiatives are tracking ahead of schedule. Keep momentum high by clearing blockers early.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Automation" color="primary" variant="outlined" />
              <Chip label="Mobile" color="secondary" variant="outlined" />
              <Chip label="Web Revamp" variant="outlined" />
            </Stack>
            <Typography variant="subtitle2">Sprint goal confidence</Typography>
            <LinearProgress variant="determinate" value={Math.min(100, summary.totals.completionRate + 10)} sx={{ height: 10, borderRadius: 10 }} />
            <Typography variant="caption" color="text.secondary">
              Updated {new Date().toLocaleTimeString()}
            </Typography>
          </Stack>
        </Paper>
      </Box>

      <NewTaskDialog
        open={isTaskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        employees={employees}
        onCreate={handleCreateTask}
        isSubmitting={createTaskMutation.isPending}
      />
    </Stack>
  );
};

