import { useEffect, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEmployees } from '../services/employees';
import { createTask, getTasks, updateTask } from '../services/tasks';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskFiltersPanel } from '../components/tasks/TaskFilters';
import { NewTaskDialog } from '../components/tasks/NewTaskDialog';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { subscribeToTaskCreated, subscribeToTaskUpdated, subscribeToTaskDeleted, initSocketClient } from '../lib/socket';

export const TasksPage = () => {
  const queryClient = useQueryClient();
  const { filters, updateFilters, resetFilters } = useTaskFilters();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [boardTasks, setBoardTasks] = useState<Task[]>([]);
  const { isAdmin } = useAuth();

  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: getEmployees });
  const {
    data: tasks = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => getTasks(filters),
  });

  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDialogOpen(false);
      showToast('Task created successfully!', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to create task';
      showToast(message, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<{ status: TaskStatus; priority: TaskPriority }> }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to update task';
      showToast(message, 'error');
      setBoardTasks(tasks);
    },
  });

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  // subscribe to real-time socket events
  useEffect(() => {
    initSocketClient();
    const unsubs: Array<() => void> = [];

    unsubs.push(
      subscribeToTaskCreated(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      })
    );

    unsubs.push(
      subscribeToTaskUpdated(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      })
    );

    unsubs.push(
      subscribeToTaskDeleted(() => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      })
    );

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [queryClient]);

  const handleCreateTask = (payload: Parameters<typeof createTask>[0]) => {
    createMutation.mutate(payload);
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setBoardTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
    updateMutation.mutate({ id: taskId, payload: { status } });
    // Optimistic local broadcast for other tabs/components
    try {
      const updated = boardTasks.find((t) => t.id === taskId);
      const payload = { ...(updated ?? { id: taskId }), status };
      document.dispatchEvent(new CustomEvent('task:updated', { detail: payload }));
    } catch (e) {
      // ignore
    }
  };

  const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
    setBoardTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, priority } : task)));
    updateMutation.mutate({ id: taskId, payload: { priority } });
    try {
      const updated = boardTasks.find((t) => t.id === taskId);
      const payload = { ...(updated ?? { id: taskId }), priority };
      document.dispatchEvent(new CustomEvent('task:updated', { detail: payload }));
    } catch (e) {
      // ignore
    }
  };

  const handleDragTask = (taskId: string, status: TaskStatus) => {
    handleStatusChange(taskId, status);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <div>
          <Typography variant="h4" fontWeight={700}>
            Task Command Center
          </Typography>
          <Typography color="text.secondary">Track delivery, triage blockers, and spin up new work streams instantly.</Typography>
          {!isAdmin && (
            <Typography variant="caption" color="text.secondary">
              You have view-only access. Ask an admin to promote you for edits.
            </Typography>
          )}
        </div>
        <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setDialogOpen(true)} disabled={!employees.length || !isAdmin}>
          New Task
        </Button>
      </Stack>

      <TaskFiltersPanel filters={filters} onChange={updateFilters} onReset={resetFilters} employees={employees} />

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" minHeight={200}>
          <CircularProgress />
        </Stack>
      ) : (
        <TaskBoard
          tasks={boardTasks}
          employees={employees}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onDragTask={handleDragTask}
          isDraggable={isAdmin}
        />
      )}

      {isFetching && <Typography variant="caption">Refreshing board...</Typography>}

      <NewTaskDialog
        open={isAdmin && isDialogOpen}
        onClose={() => setDialogOpen(false)}
        employees={employees}
        onCreate={handleCreateTask}
        isSubmitting={createMutation.isPending}
      />
    </Stack>
  );
};

