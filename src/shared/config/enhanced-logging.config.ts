export const EnhancedLoggingConfig = {
  // Request tracking configuration
  requestTracking: {
    enabled: true,
    generateRequestId: true,
    includeInResponse: true,
    headerName: 'x-request-id',
  },

  // API logging configuration
  apiLogging: {
    enabled: (process?.env?.LOG_API_REQUESTS || 'true') !== 'false',
    logLevel: process?.env?.LOG_API_LEVEL || 'info',
    logSlowRequests: true,
    logErrors: true,
    logSuccess: process?.env?.NODE_ENV === 'development',
    slowRequestThreshold: parseInt(process?.env?.SLOW_REQUEST_THRESHOLD || '1000'),
  },

  // Database logging configuration
  databaseLogging: {
    enabled: process?.env?.LOG_DATABASE_QUERIES === 'true',
    logLevel: process?.env?.LOG_DB_LEVEL || 'debug',
    logSlowQueries: true,
    logErrors: true,
    slowQueryThreshold: parseInt(process?.env?.SLOW_QUERY_THRESHOLD || '1000'),
    maxQueryLength: parseInt(process?.env?.MAX_QUERY_LOG_LENGTH || '500'),
  },

  // Business operation logging
  businessLogging: {
    enabled: (process?.env?.LOG_BUSINESS_OPERATIONS || 'true') !== 'false',
    logLevel: process?.env?.LOG_BUSINESS_LEVEL || 'info',
    logCrudOperations: true,
    logDataExports: true,
    logBulkOperations: true,
  },

  // Security logging configuration
  securityLogging: {
    enabled: (process?.env?.LOG_SECURITY_EVENTS || 'true') !== 'false',
    logLevel: process?.env?.LOG_SECURITY_LEVEL || 'warn',
    logFailedLogins: true,
    logPasswordChanges: true,
    logAdminActions: true,
    logSuspiciousActivity: true,
  },

  // Performance logging configuration
  performanceLogging: {
    enabled: process?.env?.LOG_PERFORMANCE === 'true' || process?.env?.NODE_ENV === 'development',
    logLevel: process?.env?.LOG_PERFORMANCE_LEVEL || 'info',
    logSlowOperations: true,
    logMemoryUsage: process?.env?.LOG_MEMORY_USAGE === 'true',
    slowOperationThreshold: parseInt(process?.env?.SLOW_OPERATION_THRESHOLD || '1000'),
  },

  // Error logging configuration
  errorLogging: {
    enabled: true,
    logLevel: 'error',
    logStackTraces: (process?.env?.LOG_STACK_TRACES || 'true') !== 'false',
    logUserContext: true,
    logRequestContext: true,
  },

  // Log format configuration
  format: {
    useEmojis: (process?.env?.LOG_USE_EMOJIS || 'true') !== 'false',
    useColors: (process?.env?.LOG_USE_COLORS || 'true') !== 'false',
    includeTimestamp: true,
    includeRequestId: true,
    includeContext: true,
  },

  // Log filtering
  filtering: {
    // Skip logging for these paths
    skipPaths: [
      '/health',
      '/metrics',
      '/favicon.ico',
      '/robots.txt',
    ],
    
    // Skip logging for these methods
    skipMethods: [],
    
    // Skip logging for these status codes
    skipStatusCodes: [200, 201, 204],
    
    // Only log these status codes (if specified, overrides skipStatusCodes)
    onlyStatusCodes: [],
  },

  // Log rotation configuration
  rotation: {
    maxSize: process?.env?.LOG_MAX_SIZE || '20m',
    maxFiles: process?.env?.LOG_MAX_FILES || '14d',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: (process?.env?.LOG_ZIP_ARCHIVE || 'true') !== 'false',
  },

  // Development vs Production settings
  environment: {
    development: {
      logLevel: 'debug',
      logEverything: true,
      useConsole: true,
      useFile: true,
    },
    production: {
      logLevel: 'info',
      logEverything: false,
      useConsole: false,
      useFile: true,
    },
  },
};

// Get current environment configuration
export const getCurrentLoggingConfig = () => {
  const isDevelopment = process?.env?.NODE_ENV === 'development';
  const envConfig = isDevelopment 
    ? EnhancedLoggingConfig.environment.development 
    : EnhancedLoggingConfig.environment.production;

  return {
    ...EnhancedLoggingConfig,
    ...envConfig,
  };
};
