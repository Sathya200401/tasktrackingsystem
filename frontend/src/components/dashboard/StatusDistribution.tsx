import { Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { DashboardSummary, TaskPriority, TaskStatus } from '../../types';

interface Props {
  distribution: DashboardSummary['distribution'];
  onSelectStatus?: (status?: TaskStatus) => void;
}

const statusMeta: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'Backlog', color: '#818cf8' },
  in_progress: { label: 'In Progress', color: '#fbbf24' },
  in_review: { label: 'In Review', color: '#f87171' },
  testing: { label: 'Testing', color: '#a78bfa' },
  need_review: { label: 'Need Review', color: '#fb923c' },
  done: { label: 'Done', color: '#34d399' },
};

const priorityMeta: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: '#a7f3d0' },
  medium: { label: 'Medium', color: '#93c5fd' },
  high: { label: 'High', color: '#fcd34d' },
  critical: { label: 'Critical', color: '#f87171' },
};

export const StatusDistribution = ({ distribution, onSelectStatus }: Props) => {
  const total = Object.values(distribution.status).reduce((acc, val) => acc + val, 0) || 1;
  const priorityTotal = Object.values(distribution.priority).reduce((acc, val) => acc + val, 0) || 1;

  const pieData = (Object.keys(statusMeta) as TaskStatus[]).map((key) => ({ name: statusMeta[key].label, value: distribution.status[key] ?? 0, key }));

  const handlePieClick = (_data: any, index: number) => {
    const statusKey = pieData[index]?.key;
    if (statusKey && typeof onSelectStatus === 'function') {
      onSelectStatus(statusKey);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Stack spacing={3}>
        <Typography variant="h6">Flow & Focus</Typography>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <Box sx={{ width: 220, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    onClick={handlePieClick}
                  >
                    {(pieData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={statusMeta[entry.key as TaskStatus].color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} tasks`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ flex: 1 }}>
              {Object.entries(statusMeta).map(([key, meta]) => {
                const value = distribution.status[key as TaskStatus] ?? 0;
                return (
                  <Stack key={key} spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{meta.label}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {value}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(value / total) * 100}
                      sx={{ height: 10, borderRadius: 10, backgroundColor: '#eef2ff', '& .MuiLinearProgress-bar': { backgroundColor: meta.color } }}
                    />
                  </Stack>
                );
              })}
            </Box>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Priority Mix
          </Typography>
          <Stack spacing={1.5}>
            {Object.entries(priorityMeta).map(([key, meta]) => {
              const value = distribution.priority[key as TaskPriority] ?? 0;
              return (
                <Stack key={key} spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: meta.color }} />
                      <Typography variant="body2">{meta.label}</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600}>
                      {value}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(value / priorityTotal) * 100}
                    sx={{ height: 8, borderRadius: 999, '& .MuiLinearProgress-bar': { backgroundColor: meta.color } }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

