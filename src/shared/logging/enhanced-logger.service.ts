import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger } from './winston.config';
import * as winston from 'winston';

@Injectable()
export class EnhancedLoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = createLogger(context || 'Application');
  }

  // Standard NestJS logger methods
  log(message: string, metadata?: Record<string, any>) {
    this.logger.info(message, {
      ...metadata,
      context: this.context,
      type: 'info',
      timestamp: new Date().toISOString(),
    });
  }

  error(message: string, trace?: string, metadata?: Record<string, any>) {
    this.logger.error(message, {
      ...metadata,
      trace,
      context: this.context,
      type: 'error',
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.logger.warn(message, {
      ...metadata,
      context: this.context,
      type: 'warning',
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.logger.debug(message, {
      ...metadata,
      context: this.context,
      type: 'debug',
      timestamp: new Date().toISOString(),
    });
  }

  verbose(message: string, metadata?: Record<string, any>) {
    this.logger.verbose(message, {
      ...metadata,
      context: this.context,
      type: 'verbose',
      timestamp: new Date().toISOString(),
    });
  }

  // Enhanced API logging with request tracking
  logApiRequest(requestId: string, method: string, url: string, metadata?: Record<string, any>) {
    this.logger.info('📥 API Request', {
      requestId,
      method,
      url,
      ...metadata,
      context: this.context,
      type: 'api_request',
      timestamp: new Date().toISOString(),
    });
  }

  logApiResponse(requestId: string, method: string, url: string, statusCode: number, duration: number, metadata?: Record<string, any>) {
    const isError = statusCode >= 400;
    const isSlow = duration > 1000;
    
    const logLevel = isError ? 'error' : (isSlow ? 'warn' : 'info');
    const emoji = isError ? '❌' : (isSlow ? '⚠️' : '✅');
    
    this.logger[logLevel](`${emoji} API Response`, {
      requestId,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      isError,
      isSlow,
      ...metadata,
      context: this.context,
      type: 'api_response',
      timestamp: new Date().toISOString(),
    });
  }

  // Business operation logging
  logBusinessOperation(requestId: string, operation: string, entity: string, entityId?: string, userId?: string, metadata?: Record<string, any>) {
    this.logger.info('💼 Business Operation', {
      requestId,
      operation,
      entity,
      entityId,
      userId,
      ...metadata,
      context: this.context,
      type: 'business_operation',
      timestamp: new Date().toISOString(),
    });
  }

  // Database operation logging
  logDatabaseOperation(requestId: string, operation: string, table: string, duration?: number, metadata?: Record<string, any>) {
    const isSlow = duration && duration > 1000;
    const logLevel = isSlow ? 'warn' : 'debug';
    
    this.logger[logLevel]('🗄️ Database Operation', {
      requestId,
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      isSlow,
      ...metadata,
      context: this.context,
      type: 'database_operation',
      timestamp: new Date().toISOString(),
    });
  }

  // Security event logging
  logSecurityEvent(requestId: string, event: string, userId?: string, ip?: string, metadata?: Record<string, any>) {
    this.logger.warn('🔒 Security Event', {
      requestId,
      event,
      userId,
      ip,
      ...metadata,
      context: this.context,
      type: 'security_event',
      timestamp: new Date().toISOString(),
    });
  }

  // Performance logging
  logPerformance(requestId: string, operation: string, duration: number, metadata?: Record<string, any>) {
    const isSlow = duration > 1000;
    const logLevel = isSlow ? 'warn' : 'info';
    
    this.logger[logLevel]('⚡ Performance', {
      requestId,
      operation,
      duration: `${duration}ms`,
      isSlow,
      ...metadata,
      context: this.context,
      type: 'performance',
      timestamp: new Date().toISOString(),
    });
  }

  // Error logging with request context
  logError(requestId: string, error: Error, context?: string, metadata?: Record<string, any>) {
    this.logger.error('💥 Error', {
      requestId,
      error: error.message,
      stack: error.stack,
      context: context || this.context,
      ...metadata,
      type: 'error',
      timestamp: new Date().toISOString(),
    });
  }

  // Create child logger with request context
  createRequestLogger(requestId: string, context?: string): EnhancedLoggerService {
    const childLogger = new EnhancedLoggerService(context || this.context);
    childLogger.logger = this.logger.child({ requestId });
    return childLogger;
  }
}
