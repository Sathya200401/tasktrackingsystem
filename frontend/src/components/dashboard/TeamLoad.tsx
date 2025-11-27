import { Avatar, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import type { Employee } from '../../types';

interface Props {
  employees: Employee[];
}

export const TeamLoad = ({ employees }: Props) => {
  const ranked = [...employees].sort((a, b) => (b.totalTasks ?? 0) - (a.totalTasks ?? 0));

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Team Load</Typography>
        {ranked.slice(0, 5).map((employee) => {
          const completionRate =
            !employee.totalTasks || employee.totalTasks === 0 ? 0 : Math.round(((employee.completedTasks ?? 0) / employee.totalTasks) * 100);
          return (
            <Stack key={employee.id} direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.light' }}>{employee.name.charAt(0)}</Avatar>
              <Stack flexGrow={1}>
                <Typography fontWeight={600}>{employee.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {employee.title ?? '—'} • {employee.allocation ?? 0}% allocated
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{ mt: 1, borderRadius: 8, height: 8, backgroundColor: '#f1f5f9' }}
                />
                {employee.skills && employee.skills.length > 0 && (
                  <Typography variant="caption" color="primary">
                    {employee.skills.slice(0, 2).join(' • ')}
                  </Typography>
                )}
              </Stack>
              <Typography variant="body2" fontWeight={600}>
                {completionRate}%
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
};

