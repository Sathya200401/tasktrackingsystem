import { Box, Paper, Stack, Typography, Chip, LinearProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import type { DashboardSummary } from '../../types';

interface Props {
  totals: DashboardSummary['totals'];
}

const cards = [
  {
    key: 'totalTasks',
    label: 'Total Tasks',
    icon: <PendingActionsIcon color="primary" />,
    color: 'primary.main',
  },
  {
    key: 'completedTasks',
    label: 'Completed',
    icon: <CheckCircleOutlineIcon color="success" />,
    color: 'success.main',
  },
  {
    key: 'activeEmployees',
    label: 'Active Employees',
    icon: <GroupOutlinedIcon color="secondary" />,
    color: 'secondary.main',
  },
  {
    key: 'overdueTasks',
    label: 'Overdue',
    icon: <ErrorOutlineIcon color="error" />,
    color: 'error.main',
  },
] as const;

export const KpiGrid = ({ totals }: Props) => (
  <Box
    display="grid"
    gap={2}
    gridTemplateColumns={{ xs: 'repeat(1, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }}
  >
    {cards.map((card) => (
      <Paper key={card.key} sx={{ p: 2.5, borderRadius: 2, minHeight: 170, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            {card.icon}
            <Typography variant="body2" color="text.secondary">
              {card.label}
            </Typography>
          </Stack>
          <Typography variant="h4" fontWeight={700}>
            {totals[card.key as keyof typeof totals]}
          </Typography>
          {card.key === 'completedTasks' && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Completion Rate
                </Typography>
                <Chip size="small" label={`${totals.completionRate}%`} color="success" />
              </Stack>
              <LinearProgress
                variant="determinate"
                value={totals.completionRate}
                sx={{ height: 8, borderRadius: 8, backgroundColor: 'success.lighter' }}
              />
            </>
          )}
          {card.key === 'overdueTasks' && totals.overdueTasks > 0 && (
            <Chip label="Action required" color="error" size="small" sx={{ alignSelf: 'flex-start' }} />
          )}
        </Stack>
      </Paper>
    ))}
  </Box>
);

