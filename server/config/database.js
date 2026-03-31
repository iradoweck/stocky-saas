import mongoose from 'mongoose';
import { Logger } from '../utils/logger.js';

const logger = new Logger('Database');

export async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stocky-saas';
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection failed:', error);
  }
}

export function getDatabase() {
  return mongoose.connection;
}
