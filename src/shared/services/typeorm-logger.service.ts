import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

export class TypeOrmLoggerService implements TypeOrmLogger {
  private readonly logger = new Logger('TypeORM');

  log(message: any, context?: string) {
    // Skip verbose query logs, only log important messages
    if (typeof message === 'string' && message.includes('query:')) {
      return;
    }
    if (typeof message === 'string' && message.includes('SELECT') && message.includes('FROM')) {
      return;
    }
    
    this.logger.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: any, context?: string) {
    // Skip debug logs for queries
    if (typeof message === 'string' && message.includes('query:')) {
      return;
    }
    this.logger.debug(message, context);
  }

  verbose(message: any, context?: string) {
    // Skip verbose logs for queries
    if (typeof message === 'string' && message.includes('query:')) {
      return;
    }
    this.logger.verbose(message, context);
  }

  // TypeORM Logger interface methods
  logQuery(query: string, parameters?: any[]) {
    // Skip query logs to reduce noise
    return;
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error(`Query Error: ${error}`, query);
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(`Slow Query (${time}ms): ${query.substring(0, 100)}...`);
  }

  logSchemaBuild(message: string) {
    this.logger.debug(`Schema Build: ${message}`);
  }

  logMigration(message: string) {
    this.logger.log(`Migration: ${message}`);
  }
}
