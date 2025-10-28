import { Logger } from '@nestjs/common';

export class AuditLogger {
  private static readonly logger = new Logger('Audit');

  static logUserAction(
    action: string,
    userId: string,
    resource: string,
    resourceId?: string,
    details?: any,
  ) {
    this.logger.log(
      `👤 User Action: ${action} on ${resource}${resourceId ? ` (ID: ${resourceId})` : ''} by User: ${userId}`
    );

    if (details) {
      this.logger.debug(`Details: ${JSON.stringify(details)}`);
    }
  }

  static logDataChange(
    entity: string,
    entityId: string,
    action: 'created' | 'updated' | 'deleted',
    userId: string,
    changes?: any,
  ) {
    const emoji = {
      created: '➕',
      updated: '📝',
      deleted: '🗑️',
    };

    this.logger.log(
      `${emoji[action]} Data ${action}: ${entity} (ID: ${entityId}) by User: ${userId}`
    );

    if (changes && action === 'updated') {
      this.logger.debug(`Changes: ${JSON.stringify(changes)}`);
    }
  }

  static logSystemEvent(
    event: string,
    level: 'info' | 'warn' | 'error',
    details?: any,
  ) {
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };

    this.logger[level](
      `${emoji[level]} System Event: ${event}`
    );

    if (details) {
      this.logger.debug(`Details: ${JSON.stringify(details)}`);
    }
  }

  static logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    userId?: string,
    ip?: string,
    details?: any,
  ) {
    const emoji = {
      low: '🔍',
      medium: '⚠️',
      high: '🚨',
      critical: '🚨🚨',
    };

    this.logger.warn(
      `${emoji[severity]} Security Event: ${event} - Severity: ${severity.toUpperCase()}${userId ? ` - User: ${userId}` : ''}${ip ? ` - IP: ${ip}` : ''}`
    );

    if (details) {
      this.logger.debug(`Details: ${JSON.stringify(details)}`);
    }
  }

  static logPerformance(
    operation: string,
    duration: number,
    threshold: number = 1000,
    details?: any,
  ) {
    if (duration > threshold) {
      this.logger.warn(
        `🐌 Performance Alert: ${operation} took ${duration}ms (threshold: ${threshold}ms)`
      );
    } else {
      this.logger.debug(
        `⚡ Performance: ${operation} completed in ${duration}ms`
      );
    }

    if (details) {
      this.logger.debug(`Details: ${JSON.stringify(details)}`);
    }
  }
}
