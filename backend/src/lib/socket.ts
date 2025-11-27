import { Server as IOServer } from 'socket.io';
import http from 'http';
import { env } from '../config/env';

let io: IOServer | null = null;

export const initSocket = (server: http.Server) => {
  if (io) return io;
  io = new IOServer(server, {
    cors: {
      origin: env.clientOrigins,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    // eslint-disable-next-line no-console
    console.log('Socket connected', socket.id);

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log('Socket disconnected', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
