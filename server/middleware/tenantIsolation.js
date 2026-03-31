import { AuthorizationError } from '../utils/errors.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('TenantIsolationMiddleware');

export function tenantIsolationMiddleware(req, res, next) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required', code: 'AUTHENTICATION_ERROR' });
    return;
  }

  // Extract tenantId from request (query, params, or body)
  const tenantIdFromRequest = req.query.tenantId || req.params.tenantId || req.body?.tenantId;

  // Verify tenant ID matches authenticated user's tenant
  if (tenantIdFromRequest && tenantIdFromRequest !== req.user.tenantId) {
    logger.warn(`Tenant isolation violation: User ${req.user.userId} attempted to access tenant ${tenantIdFromRequest}`);
    throw new AuthorizationError('Access denied: Tenant mismatch');
  }

  // Attach tenant ID to request for use in route handlers
  req.tenantId = req.user.tenantId;

  next();
}

export function validateTenantAccess(req, tenantId) {
  if (!req.user) {
    return false;
  }

  return req.user.tenantId === tenantId;
}
