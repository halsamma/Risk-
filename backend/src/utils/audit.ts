import { Request } from 'express';
import { db } from '../config/database';
import { generateSecureId } from './crypto';
import { logger } from './logger';

export function auditLog(
  action: string,
  options: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    req?: Request;
  } = {}
): void {
  try {
    db.prepare(`
      INSERT INTO audit_log (id, user_id, action, resource_type, resource_id, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      generateSecureId(),
      options.userId ?? null,
      action,
      options.resourceType ?? null,
      options.resourceId ?? null,
      options.req?.ip ?? null,
      options.req?.headers['user-agent'] ?? null,
      options.details ? JSON.stringify(options.details) : null
    );
  } catch (err) {
    logger.error('Failed to write audit log:', err);
  }
}
