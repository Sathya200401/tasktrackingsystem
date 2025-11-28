import { Avatar, LinearProgress, Paper, Stack, Typography, Box } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';
import type { Employee } from '../../types';

interface Props {
  employees: Employee[];
}

export const TeamLoad = ({ employees }: Props) => {
  const ranked = [...employees].sort((a, b) => (b.totalTasks ?? 0) - (a.totalTasks ?? 0)).slice(0, 8);

  const data = ranked.map((e) => ({
    name: e.name,
    total: e.totalTasks ?? 0,
    completed: e.completedTasks ?? 0,
    allocation: e.allocation ?? 0,
    id: e.id,
  }));

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Team Load</Typography>
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
              <Legend />
              <ReferenceLine x={0} stroke="#eee" />
              <Bar dataKey="total" name="Total Tasks" stackId="a" fill="#93c5fd">
                {data.map((_, idx) => (
                  <Cell key={`cell-total-${idx}`} />
                ))}
              </Bar>
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#34d399">
                {data.map((_, idx) => (
                  <Cell key={`cell-comp-${idx}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {ranked.map((employee) => {
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

