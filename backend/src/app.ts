import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { employeeRoutes } from './app/routes/employeeRoutes';
import { taskRoutes } from './app/routes/taskRoutes';
import { dashboardRoutes } from './app/routes/dashboardRoutes';
import { authRoutes } from './app/routes/authRoutes';
import { errorHandler, notFoundHandler } from './app/middleware/errorHandler';

export const app = express();

app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

