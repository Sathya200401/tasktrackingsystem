import { config } from 'dotenv';

config();

const clientOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/employee_task_tracker',
  clientOrigins,
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  tokenExpiresIn: process.env.JWT_EXPIRES_IN ?? '2d',
};

