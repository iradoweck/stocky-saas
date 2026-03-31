import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

const LOG_DIR = config.LOG_DIR;
const LOG_LEVEL = config.LOG_LEVEL;

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

export class Logger {
  constructor(context) {
    this.context = context;
    this.logFile = path.join(LOG_DIR, `${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${dataStr}`;
  }

  writeLog(level, message, data) {
    const formattedMessage = this.formatMessage(level, message, data);

    // Console output
    if (LOG_LEVELS[level] <= LOG_LEVELS[LOG_LEVEL]) {
      const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleMethod(formattedMessage);
    }

    // File output
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  error(message, data) {
    this.writeLog('error', message, data);
  }

  warn(message, data) {
    this.writeLog('warn', message, data);
  }

  info(message, data) {
    this.writeLog('info', message, data);
  }

  debug(message, data) {
    this.writeLog('debug', message, data);
  }
}
