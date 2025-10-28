import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

// Custom format for structured JSON logging
const jsonLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json(),
);

// Custom format for console (development)
const consoleLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('BE-LAW', {
    colors: true,
    prettyPrint: true,
  }),
);

// Helper function to create transport with increased max listeners
const createRotateTransport = (options: any): DailyRotateFile => {
  const transport = new DailyRotateFile(options);
  transport.setMaxListeners(20); // Increase max listeners to prevent warnings
  return transport;
};

// Transport cho application logs
const applicationTransport = createRotateTransport({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: jsonLogFormat,
  level: 'info',
});

// Transport cho error logs
const errorTransport = createRotateTransport({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: jsonLogFormat,
  level: 'error',
});

// Transport cho security logs
const securityTransport = createRotateTransport({
  filename: 'logs/security-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '90d',
  format: jsonLogFormat,
  level: 'info',
});

// Transport cho audit logs
const auditTransport = createRotateTransport({
  filename: 'logs/audit-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '90d',
  format: jsonLogFormat,
  level: 'info',
});

// Transport cho API access logs
const accessTransport = createRotateTransport({
  filename: 'logs/access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '50m',
  maxFiles: '14d',
  format: jsonLogFormat,
  level: 'info',
});

// Transport cho database logs
const databaseTransport = createRotateTransport({
  filename: 'logs/database-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: jsonLogFormat,
  level: 'info',
});

// Console transport (development only)
const consoleTransport = new winston.transports.Console({
  format: consoleLogFormat,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
consoleTransport.setMaxListeners(20);

export const winstonConfig = {
  transports: [
    consoleTransport,
    applicationTransport,
    errorTransport,
    securityTransport,
    auditTransport,
    accessTransport,
    databaseTransport,
  ],
  exitOnError: false,
};

// Create a single logger instance to be shared
const baseLogger = winston.createLogger({
  defaultMeta: { service: 'be-law-official' },
  ...winstonConfig,
});

// Create loggers for different contexts (child loggers share transports)
export const createLogger = (context: string) => {
  return baseLogger.child({ context });
};

// Export specific loggers (these are child loggers, not creating new transports)
export const applicationLogger = createLogger('Application');
export const securityLogger = createLogger('Security');
export const auditLogger = createLogger('Audit');
export const accessLogger = createLogger('Access');
export const databaseLogger = createLogger('Database');
export const errorLogger = createLogger('Error');

