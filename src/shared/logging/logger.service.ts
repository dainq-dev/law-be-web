import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger } from './winston.config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = createLogger(context || 'Application');
  }

  log(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, {
      ...metadata,
      context: this.context,
      type: 'info',
    });
  }

  error(message: string, trace?: string, metadata?: Record<string, any>) {
    this.logger.error(message, {
      ...metadata,
      trace,
      context: this.context,
      type: 'error',
    });
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.logger.warn(message, {
      ...metadata,
      context: this.context,
      type: 'warning',
    });
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.logger.debug(message, {
      ...metadata,
      context: this.context,
      type: 'debug',
    });
  }

  verbose(message: string, metadata?: Record<string, any>) {
    this.logger.verbose(message, {
      ...metadata,
      context: this.context,
      type: 'verbose',
    });
  }

  // Structured logging methods
  logApiCall(method: string, url: string, statusCode: number, duration: number, metadata?: Record<string, any>) {
    this.logger.info('API Call', {
      method,
      url,
      statusCode,
      duration,
      ...metadata,
      context: this.context,
      type: 'api_call',
    });
  }

  logDatabaseQuery(query: string, duration: number, parameters?: any) {
    this.logger.debug('Database Query', {
      query: query.substring(0, 500), // Limit query length
      duration,
      parameters,
      context: this.context,
      type: 'db_query',
    });
  }

  logSecurityEvent(event: string, userId?: string, ip?: string, metadata?: Record<string, any>) {
    this.logger.info('Security Event', {
      event,
      userId,
      ip,
      ...metadata,
      context: this.context,
      type: 'security',
    });
  }

  logAuditEvent(action: string, userId: string, resource: string, metadata?: Record<string, any>) {
    this.logger.info('Audit Event', {
      action,
      userId,
      resource,
      ...metadata,
      context: this.context,
      type: 'audit',
    });
  }

  logBusinessOperation(operation: string, entity: string, entityId: string, userId?: string, metadata?: Record<string, any>) {
    this.logger.info('Business Operation', {
      operation,
      entity,
      entityId,
      userId,
      ...metadata,
      context: this.context,
      type: 'business',
    });
  }

  logPerformance(operation: string, duration: number, metadata?: Record<string, any>) {
    const level = duration > 1000 ? 'warn' : 'info';
    this.logger.log(level, 'Performance Metric', {
      operation,
      duration,
      slow: duration > 1000,
      ...metadata,
      context: this.context,
      type: 'performance',
    });
  }
}

