import { SetMetadata } from '@nestjs/common';

export interface AuditLogOptions {
  action: string;
  resource: string;
  logLevel?: 'info' | 'warn' | 'error';
  includeRequestBody?: boolean;
  includeResponseData?: boolean;
}

export const AUDIT_LOG_KEY = 'auditLog';

export const AuditLog = (options: AuditLogOptions) => SetMetadata(AUDIT_LOG_KEY, options);
