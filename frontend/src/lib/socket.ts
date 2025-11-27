import { io, type Socket } from 'socket.io-client';

type Callback = (data: any) => void;

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocketClient = () => {
  if (socket && socket.connected) return socket;
  socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

  socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('Connected to socket server', socket?.id);
  });

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Disconnected from socket server');
  });

  return socket;
};

export const subscribeToTaskCreated = (cb: Callback) => {
  const s = initSocketClient();
  s.on('task:created', cb);
  return () => s.off('task:created', cb);
};

export const subscribeToTaskUpdated = (cb: Callback) => {
  const s = initSocketClient();
  s.on('task:updated', cb);
  return () => s.off('task:updated', cb);
};

export const subscribeToTaskDeleted = (cb: (id: string) => void) => {
  const s = initSocketClient();
  s.on('task:deleted', (data: any) => cb(data.id));
  return () => s.off('task:deleted');
};

export const emitTaskStatusChange = (taskId: string, status: string) => {
  const s = socket ?? initSocketClient();
  s.emit('task:updateStatus', { taskId, status });
};

export const emitTaskPriorityChange = (taskId: string, priority: string) => {
  const s = socket ?? initSocketClient();
  s.emit('task:updatePriority', { taskId, priority });
};

