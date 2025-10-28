import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from '../logging/logger.service';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class ErrorLoggerInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(private readonly prometheusService: PrometheusService) {
    this.logger = new LoggerService('Error');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip, headers } = request;

    return next.handle().pipe(
      catchError((error) => {
        const errorContext = {
          method,
          url,
          statusCode: error.status || 500,
          message: error.message,
          user: user?.id || 'anonymous',
          ip: ip || 'unknown',
          userAgent: headers['user-agent'] || 'unknown',
          timestamp: new Date().toISOString(),
        };

        // Track error metrics
        const errorType = this.getErrorType(error);
        const severity = error.status >= 500 ? 'error' : 'warning';
        
        this.prometheusService.errorsTotal.inc({
          type: errorType,
          severity,
        });

        // Log different types of errors with appropriate levels
        if (error.status >= 500) {
          // Server errors - log with full context
          this.logger.error(
            `Server Error: ${error.message}`,
            error.stack,
            {
              ...errorContext,
              body: this.sanitizeRequestBody(body),
            }
          );
        } else if (error.status >= 400) {
          // Client errors - log with less detail
          this.logger.warn('Client Error', {
            ...errorContext,
            errorType,
          });
        } else {
          // Other errors
          this.logger.error(
            `Unexpected Error: ${error.message}`,
            error.stack,
            errorContext
          );
        }

        // Log database errors specifically
        if (error.name === 'QueryFailedError' || error.name === 'TypeORMError') {
          this.logger.error(
            `Database Error: ${error.message}`,
            error.stack,
            {
              query: error.query?.substring(0, 200),
              parameters: this.sanitizeParameters(error.parameters),
              user: user?.id || 'anonymous',
              type: 'database',
            }
          );

          this.prometheusService.errorsTotal.inc({
            type: 'database',
            severity: 'error',
          });
        }

        // Log validation errors
        if (error.name === 'ValidationError' || error.status === 400) {
          this.logger.warn('Validation Error', {
            message: error.message,
            method,
            url,
            userId: user?.id,
            validationErrors: error.response?.message,
          });

          // Track specific validation errors if available
          if (Array.isArray(error.response?.message)) {
            error.response.message.forEach((msg: any) => {
              const field = typeof msg === 'string' ? 'unknown' : msg.property || 'unknown';
              const constraint = typeof msg === 'string' ? msg : Object.keys(msg.constraints || {})[0] || 'unknown';
              
              this.prometheusService.validationErrorsTotal.inc({
                field,
                constraint,
              });
            });
          }
        }

        return throwError(() => error);
      }),
    );
  }

  private getErrorType(error: any): string {
    if (error.name === 'QueryFailedError' || error.name === 'TypeORMError') {
      return 'database';
    }
    if (error.name === 'ValidationError' || error.status === 400) {
      return 'validation';
    }
    if (error.status === 401) {
      return 'authentication';
    }
    if (error.status === 403) {
      return 'authorization';
    }
    if (error.status === 404) {
      return 'not_found';
    }
    if (error.status >= 500) {
      return 'server';
    }
    if (error.status >= 400) {
      return 'client';
    }
    return 'unknown';
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...body };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeParameters(parameters: any): any {
    if (!parameters || !Array.isArray(parameters)) return parameters;

    return parameters.map((param, index) => {
      if (typeof param === 'string' && param.length > 100) {
        return param.substring(0, 100) + '...';
      }
      return param;
    });
  }
}
