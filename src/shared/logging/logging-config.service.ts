import { Injectable } from '@nestjs/common';
import { LoggingConfig } from '../config/logging.config';

@Injectable()
export class LoggingConfigService {
  private readonly config = LoggingConfig;

  /**
   * Check if we should log API requests
   */
  shouldLogApiRequests(): boolean {
    return this.config.application.logRequests;
  }

  /**
   * Check if we should log database queries
   */
  shouldLogDatabaseQueries(): boolean {
    return this.config.database.logQueries;
  }

  /**
   * Check if we should log business operations
   */
  shouldLogBusinessOperations(): boolean {
    return this.config.business.enabled;
  }

  /**
   * Check if we should log security events
   */
  shouldLogSecurityEvents(): boolean {
    return this.config.security.enabled;
  }

  /**
   * Check if we should log performance metrics
   */
  shouldLogPerformance(): boolean {
    return this.config.performance.enabled;
  }

  /**
   * Get slow request threshold
   */
  getSlowRequestThreshold(): number {
    return this.config.application.slowRequestThreshold;
  }

  /**
   * Get slow operation threshold
   */
  getSlowOperationThreshold(): number {
    return this.config.performance.slowOperationThreshold;
  }

  /**
   * Check if request is slow
   */
  isSlowRequest(duration: number): boolean {
    return duration > this.getSlowRequestThreshold();
  }

  /**
   * Check if operation is slow
   */
  isSlowOperation(duration: number): boolean {
    return duration > this.getSlowOperationThreshold();
  }

  /**
   * Get current log level
   */
  getLogLevel(): string {
    return this.config.application.logLevel;
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Get configuration for specific log type
   */
  getConfigForType(type: 'api' | 'database' | 'business' | 'security' | 'performance' | 'error') {
    switch (type) {
      case 'api':
        return {
          enabled: this.shouldLogApiRequests(),
          slowThreshold: this.getSlowRequestThreshold(),
        };
      case 'database':
        return {
          enabled: this.shouldLogDatabaseQueries(),
          slowThreshold: this.config.database.slowQueryThreshold,
        };
      case 'business':
        return {
          enabled: this.shouldLogBusinessOperations(),
          logCrud: this.config.business.logCrudOperations,
          logExports: this.config.business.logDataExports,
          logBulk: this.config.business.logBulkOperations,
        };
      case 'security':
        return {
          enabled: this.shouldLogSecurityEvents(),
          logFailedLogins: this.config.security.logFailedLogins,
          logPasswordChanges: this.config.security.logPasswordChanges,
          logAdminActions: this.config.security.logAdminActions,
        };
      case 'performance':
        return {
          enabled: this.shouldLogPerformance(),
          slowThreshold: this.getSlowOperationThreshold(),
          monitorMemory: this.config.performance.monitorMemory,
        };
      case 'error':
        return {
          enabled: this.config.errors.enabled,
          logStackTraces: this.config.errors.logStackTraces,
          logRequestContext: this.config.errors.logRequestContext,
        };
      default:
        return {};
    }
  }
}
