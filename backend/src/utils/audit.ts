import { Request } from 'express';
import { AuditLog } from '../models/AuditLog.js';

interface LogOptions {
  userId?: any;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  details?: Record<string, any>;
  req?: Request;
}

export const recordAuditLog = async (options: LogOptions): Promise<void> => {
  try {
    const ipAddress = options.req
      ? (options.req.headers['x-forwarded-for'] as string) || options.req.socket.remoteAddress
      : undefined;
    const userAgent = options.req ? options.req.headers['user-agent'] : undefined;

    await AuditLog.create({
      userId: options.userId,
      userEmail: options.userEmail,
      userRole: options.userRole,
      action: options.action,
      module: options.module,
      details: options.details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('[AuditLog] Error recording audit log:', error);
  }
};
