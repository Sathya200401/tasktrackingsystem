import { Box, Paper, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, TaskStatus, Employee } from '../../types';
import { TaskCard } from './TaskCard';
import EmptyState from '../common/EmptyState';
import { EditTaskDialog } from './EditTaskDialog';
import { deleteTask } from '../../services/tasks';
import { useToast } from '../../context/ToastContext';

interface Props {
  tasks: Task[];
  employees: Employee[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: Task['priority']) => void;
  onDragTask?: (taskId: string, status: TaskStatus) => void;
  isDraggable?: boolean;
}

const columns: Array<{ status: TaskStatus; title: string; accent: string }> = [
  { status: 'todo', title: 'Backlog', accent: '#dbeafe' },
  { status: 'in_progress', title: 'In Progress', accent: '#fef3c7' },
  { status: 'in_review', title: 'In Review', accent: '#e0e7ff' },
  { status: 'testing', title: 'Testing', accent: '#f3e8ff' },
  { status: 'need_review', title: 'Need Review', accent: '#fee2e2' },
  { status: 'done', title: 'Done', accent: '#dcfce7' },
];

const statusAccentMap: Record<TaskStatus, string> = {
  todo: '#4f46e5',
  in_progress: '#ea580c',
  in_review: '#6366f1',
  testing: '#a855f7',
  need_review: '#dc2626',
  done: '#16a34a',
};

export const TaskBoard = ({ tasks, employees, onStatusChange, onPriorityChange, onDragTask, isDraggable }: Props) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      showToast('Task deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    },
    onError: (error: any) => {
      showToast(error.response?.data?.message || 'Failed to delete task', 'error');
    },
  });

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete?.id) {
      deleteMutation.mutate(taskToDelete.id);
    }
  };

  const grouped = columns.map((column) => ({
    ...column,
    items: tasks.filter((task) => task.status === column.status),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!onDragTask || !isDraggable) return;
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    onDragTask(draggableId, destination.droppableId as TaskStatus);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="grid" gap={3} gridTemplateColumns={{ xs: 'repeat(1, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }}>
          {grouped.map((column) => (
            <Droppable droppableId={column.status} key={column.status} isDropDisabled={!isDraggable}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ p: 2.5, borderRadius: 2, minHeight: 420, backgroundColor: '#ffffff', borderTop: `4px solid ${column.accent}` }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700}>
                        {column.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {column.items.length}
                      </Typography>
                    </Stack>
                    <div>
                      {column.items.length === 0 ? (
                        <EmptyState title="No tasks" subtitle="Drag tasks here or create a new one" showIcon={false} />
                      ) : (
                        column.items.map((task, index) => {
                        const card = (
                          <TaskCard
                            key={task.id}
                            task={task}
                            statusAccent={statusAccentMap[task.status]}
                            onStatusChange={onStatusChange}
                            onPriorityChange={onPriorityChange}
                            onEdit={isDraggable ? handleEditClick : undefined}
                            onDelete={isDraggable ? handleDeleteClick : undefined}
                            isReadOnly={!isDraggable}
                          />
                        );
                        if (!isDraggable) {
                          return card;
                        }
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(dragProvided) => (
                              <Box ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                                {card}
                              </Box>
                            )}
                          </Draggable>
                        );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  </Stack>
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>

      {selectedTask && (
        <EditTaskDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          task={selectedTask}
          employees={employees}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{taskToDelete?.title}</strong>? This action cannot be undone.
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
};;

