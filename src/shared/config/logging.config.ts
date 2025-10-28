import { LogLevel } from 'typeorm';

export const LoggingConfig = {
  // Database logging configuration
  database: {
    // Enable/disable query logging
    logQueries: process.env.DATABASE_LOG_QUERIES === 'true',
    
    // Log levels for TypeORM
    levels: process.env.NODE_ENV === 'development' 
      ? (['error', 'warn', 'migration'] as LogLevel[])
      : (['error'] as LogLevel[]),
    
    // Log slow queries (in milliseconds)
    slowQueryThreshold: 1000,
  },
  application: {
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Log request/response for debugging
    logRequests: process.env.NODE_ENV === 'development',
    
    // Log only slow requests (> 100ms)
    slowRequestThreshold: 100,
  },

  // Security logging configuration
  security: {
    // Enable security event logging
    enabled: true,
    
    // Log failed login attempts
    logFailedLogins: true,
    
    // Log password changes
    logPasswordChanges: true,
    
    // Log admin actions
    logAdminActions: true,
  },

  // Business logging configuration
  business: {
    // Enable business operation logging
    enabled: true,
    
    // Log CRUD operations
    logCrudOperations: true,
    
    // Log data exports
    logDataExports: true,
    
    // Log bulk operations
    logBulkOperations: true,
  },

  // Performance monitoring configuration
  performance: {
    // Enable performance monitoring
    enabled: process.env.NODE_ENV === 'development',
    
    // Monitor memory usage
    monitorMemory: true,
    
    // Log slow operations
    logSlowOperations: true,
    
    // Slow operation threshold (ms)
    slowOperationThreshold: 1000,
  },

  // Error logging configuration
  errors: {
    // Enable detailed error logging
    enabled: true,
    
    // Log stack traces
    logStackTraces: process.env.NODE_ENV === 'development',
    
    // Log request context with errors
    logRequestContext: true,
    
    // Sanitize sensitive data
    sanitizeSensitiveData: true,
  },
};
