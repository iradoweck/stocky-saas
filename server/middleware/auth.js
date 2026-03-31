import { verifyToken } from '../utils/jwt.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('AuthMiddleware');

export function authMiddleware(req, res, next) {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const payload = verifyToken(token);
    req.user = payload;

    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({ error: error.message, code: error.code });
    } else {
      res.status(401).json({ error: 'Authentication failed', code: 'AUTHENTICATION_ERROR' });
    }
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'AUTHENTICATION_ERROR' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.userId} with role ${req.user.role}`);
      res.status(403).json({ error: 'Access denied', code: 'AUTHORIZATION_ERROR' });
      return;
    }

    next();
  };
}

export function requirePermission(...permissions) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'AUTHENTICATION_ERROR' });
      return;
    }

    // TODO: Implement permission checking from user document
    next();
  };
}

function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
