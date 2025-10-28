import { Injectable } from '@nestjs/common';
import { EnhancedLoggerService } from './enhanced-logger.service';
import { LoggingConfigService } from './logging-config.service';

@Injectable()
export class SmartLoggerService {
  private readonly logger: EnhancedLoggerService;
  private readonly config: LoggingConfigService;

  constructor() {
    this.logger = new EnhancedLoggerService('Smart-Logger');
    this.config = new LoggingConfigService();
  }

  /**
   * Smart API request logging - only logs when necessary
   */
  logApiRequest(requestId: string, method: string, url: string, metadata?: Record<string, any>) {
    if (!this.config.shouldLogApiRequests()) return;

    this.logger.logApiRequest(requestId, method, url, metadata);
  }

  /**
   * Smart API response logging - only logs errors, slow requests, or in development
   */
  logApiResponse(
    requestId: string, 
    method: string, 
    url: string, 
    statusCode: number, 
    duration: number, 
    metadata?: Record<string, any>
  ) {
    const shouldLog = 
      statusCode >= 400 || // Always log errors
      this.config.isSlowRequest(duration) || // Always log slow requests
      this.config.isDevelopment(); // Log everything in development

    if (!shouldLog) return;

    this.logger.logApiResponse(requestId, method, url, statusCode, duration, metadata);
  }

  /**
   * Smart database operation logging
   */
  logDatabaseOperation(
    requestId: string, 
    operation: string, 
    table: string, 
    duration?: number, 
    metadata?: Record<string, any>
  ) {
    if (!this.config.shouldLogDatabaseQueries()) return;

    // Only log slow queries or errors in production
    if (this.config.isProduction() && duration && !this.config.isSlowOperation(duration)) {
      return;
    }

    this.logger.logDatabaseOperation(requestId, operation, table, duration, metadata);
  }

  /**
   * Smart business operation logging
   */
  logBusinessOperation(
    requestId: string, 
    operation: string, 
    entity: string, 
    entityId?: string, 
    userId?: string, 
    metadata?: Record<string, any>
  ) {
    if (!this.config.shouldLogBusinessOperations()) return;

    this.logger.logBusinessOperation(requestId, operation, entity, entityId, userId, metadata);
  }

  /**
   * Smart security event logging
   */
  logSecurityEvent(
    requestId: string, 
    event: string, 
    userId?: string, 
    ip?: string, 
    metadata?: Record<string, any>
  ) {
    if (!this.config.shouldLogSecurityEvents()) return;

    this.logger.logSecurityEvent(requestId, event, userId, ip, metadata);
  }

  /**
   * Smart performance logging
   */
  logPerformance(
    requestId: string, 
    operation: string, 
    duration: number, 
    metadata?: Record<string, any>
  ) {
    if (!this.config.shouldLogPerformance()) return;

    // Only log slow operations or in development
    const shouldLog = this.config.isSlowOperation(duration) || this.config.isDevelopment();
    
    if (!shouldLog) return;

    this.logger.logPerformance(requestId, operation, duration, metadata);
  }

  /**
   * Smart error logging - always logs errors
   */
  logError(requestId: string, error: Error, context?: string, metadata?: Record<string, any>) {
    this.logger.logError(requestId, error, context, metadata);
  }

  /**
   * Smart general logging with level-based filtering
   */
  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, metadata?: Record<string, any>) {
    const currentLevel = this.config.getLogLevel();
    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentPriority = levelPriority[currentLevel as keyof typeof levelPriority] || 1;
    const messagePriority = levelPriority[level];

    if (messagePriority < currentPriority) return;

    switch (level) {
      case 'info':
        this.logger.log(message, metadata);
        break;
      case 'warn':
        this.logger.warn(message, metadata);
        break;
      case 'error':
        this.logger.error(message, undefined, metadata);
        break;
      case 'debug':
        this.logger.debug(message, metadata);
        break;
    }
  }

  /**
   * Create request-specific logger
   */
  createRequestLogger(requestId: string, context?: string): SmartLoggerService {
    const childLogger = new SmartLoggerService();
    // Create a new logger instance with the request context
    const requestLogger = this.logger.createRequestLogger(requestId, context);
    // Copy the logger instance to the child logger
    (childLogger as any).logger = requestLogger;
    return childLogger;
  }
}
