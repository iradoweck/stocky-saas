import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { connectDatabase } from './config/database.js';
import { config, validateConfig } from './config/env.js';
import { Logger } from './utils/logger.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { tenantIsolationMiddleware } from './middleware/tenantIsolation.js';

const logger = new Logger('Server');

const app = express();

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error('Configuration validation failed:', error);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (will be added as features are implemented)
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/products', authMiddleware, tenantIsolationMiddleware, (await import('./routes/products.js')).default);
app.use('/api/inventory', authMiddleware, tenantIsolationMiddleware, (await import('./routes/inventory.js')).default);
app.use('/api/purchases', authMiddleware, tenantIsolationMiddleware, (await import('./routes/purchases.js')).default);
app.use('/api/sales', authMiddleware, tenantIsolationMiddleware, (await import('./routes/sales.js')).default);
app.use('/api/debtors', authMiddleware, tenantIsolationMiddleware, (await import('./routes/debtors.js')).default);
app.use('/api/sync', authMiddleware, tenantIsolationMiddleware, (await import('./routes/sync.js')).default);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`API URL: ${config.API_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
