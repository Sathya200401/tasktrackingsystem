import { connectDB } from './config/db';
import { env } from './config/env';
import { app } from './app';
import http from 'http';
import { initSocket } from './lib/socket';

const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);

  // initialize socket.io
  initSocket(server);

  server.listen(env.port, () => {
    console.log(`API ready on http://localhost:${env.port}`); // eslint-disable-line no-console
  });
};

startServer();

