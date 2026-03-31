import { AppError, ValidationError } from '../utils/errors.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('ErrorHandler');

export function errorHandlerMiddleware(error, req, res, next) {
  logger.error('Unhandled error:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      ...(error instanceof ValidationError && { errors: error.errors }),
    });
    return;
  }

  // Handle MongoDB errors
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    res.status(500).json({
      error: 'Database error',
      code: 'DATABASE_ERROR',
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation error',
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
