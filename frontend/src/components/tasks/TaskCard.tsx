import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from '../../lib/dayjs';
import type { Task, TaskPriority, TaskStatus } from '../../types';

interface Props {
  task: Task;
  statusAccent: string;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: TaskPriority) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isReadOnly?: boolean;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Backlog',
  in_progress: 'In Progress',
  in_review: 'In Review',
  testing: 'Testing',
  need_review: 'Need Review',
  done: 'Done',
};

const priorityColors: Record<TaskPriority, string> = {
  low: '#a7f3d0',
  medium: '#bfdbfe',
  high: '#fde68a',
  critical: '#fecdd3',
};
const priorityOptions = Object.keys(priorityColors) as TaskPriority[];

export const TaskCard = ({ task, statusAccent, onStatusChange, onPriorityChange, onEdit, onDelete, isReadOnly }: Props) => (
  <Card variant="outlined" sx={{ borderRadius: 2, mb: 2, borderLeft: `4px solid ${statusAccent}` }}>
    <CardContent>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600}>{task.title}</Typography>
          <Stack direction="row" spacing={0.5}>
            {onEdit && (
              <Tooltip title="Edit task">
                <IconButton size="small" color="primary" onClick={() => onEdit(task)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete task">
                <IconButton size="small" color="error" onClick={() => onDelete(task)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {task.description && (
          <Typography variant="body2" color="text.secondary">
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {task.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>

        {(task.milestone || task.estimatedHours) && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {task.milestone && (
              <Chip label={task.milestone} size="small" color="secondary" variant="outlined" sx={{ textTransform: 'none' }} />
            )}
            {typeof task.estimatedHours === 'number' && (
              <Chip label={`${task.estimatedHours}h`} size="small" variant="outlined" />
            )}
          </Stack>
        )}

        {task.linkedDocs && task.linkedDocs.length > 0 && (
          <Stack spacing={0.5}>
            {task.linkedDocs.slice(0, 2).map((link) => (
              <Typography
                key={link}
                variant="caption"
                component="a"
                href={link}
                target="_blank"
                rel="noreferrer"
                color="primary"
                sx={{ wordBreak: 'break-all' }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
        )}

        <Divider />

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={statusLabels[task.status]}
            size="small"
            color={task.status === 'done' ? 'success' : task.status === 'in_review' || task.status === 'need_review' ? 'error' : 'default'}
            icon={<Box sx={{ width: 8, height: 8, bgcolor: statusAccent, borderRadius: '50%' }} />}
          />
          <Select
            size="small"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            sx={{ minWidth: 140 }}
            disabled={isReadOnly}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={task.priority}
            size="small"
            sx={{ textTransform: 'capitalize', backgroundColor: priorityColors[task.priority], fontWeight: 600 }}
          />
          <Select size="small" value={task.priority} onChange={(e) => onPriorityChange(task.id, e.target.value as TaskPriority)} sx={{ minWidth: 120 }} disabled={isReadOnly}>
            {priorityOptions.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>{task.assignedTo?.name?.charAt(0) ?? '?'}</Avatar>
            <Typography variant="body2">{task.assignedTo?.name}</Typography>
          </Stack>
          {task.dueDate && (
            <Typography variant="caption" color={dayjs(task.dueDate).isBefore(dayjs()) ? 'error.main' : 'text.secondary'}>
              Due {dayjs(task.dueDate).format('MMM D')}
            </Typography>
          )}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

