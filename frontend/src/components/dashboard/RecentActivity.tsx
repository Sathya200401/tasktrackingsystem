import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, Typography } from '@mui/material';
import dayjs from '../../lib/dayjs';
import type { DashboardSummary } from '../../types';

interface Props {
  tasks: DashboardSummary['recentActivities'];
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  todo: 'default',
  in_progress: 'warning',
  blocked: 'error',
  done: 'success',
};

export const RecentActivity = ({ tasks }: Props) => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Stack spacing={2}>
      <Typography variant="h6">Recent Activity</Typography>
      <List disablePadding>
        {tasks.map((task) => (
          <ListItem key={task.id} disableGutters divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.light' }}>{task.assignedTo?.name?.charAt(0) ?? 'T'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography fontWeight={600}>{task.title}</Typography>}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {task.assignedTo?.name} • {dayjs(task.updatedAt).fromNow()}
                </Typography>
              }
            />
            <Chip label={task.status.replace('_', ' ')} color={statusColors[task.status] ?? 'default'} sx={{ textTransform: 'capitalize' }} />
          </ListItem>
        ))}
      </List>
    </Stack>
  </Paper>
);

