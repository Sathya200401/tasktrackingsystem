import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected'); // eslint-disable-line no-console
  } catch (error) {
    console.error('Mongo connection error', error); // eslint-disable-line no-console
    process.exit(1);
  }
};

