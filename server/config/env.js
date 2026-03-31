import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/stocky-saas',
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/stocky-saas-test',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@stocky-saas.com',

  // Owner Notifications
  OWNER_EMAIL: process.env.OWNER_EMAIL || 'owner@stocky-saas.com',

  // PDF
  PDF_COMPANY_NAME: process.env.PDF_COMPANY_NAME || 'Stocky SaaS',
  PDF_COMPANY_ADDRESS: process.env.PDF_COMPANY_ADDRESS || '123 Business Street',
  PDF_COMPANY_PHONE: process.env.PDF_COMPANY_PHONE || '+1234567890',
  PDF_COMPANY_EMAIL: process.env.PDF_COMPANY_EMAIL || 'info@stocky-saas.com',

  // Offline Sync
  SYNC_BATCH_SIZE: parseInt(process.env.SYNC_BATCH_SIZE || '50', 10),
  SYNC_RETRY_ATTEMPTS: parseInt(process.env.SYNC_RETRY_ATTEMPTS || '3', 10),
  SYNC_RETRY_DELAY: parseInt(process.env.SYNC_RETRY_DELAY || '5000', 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || './logs',
};

export function validateConfig() {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
