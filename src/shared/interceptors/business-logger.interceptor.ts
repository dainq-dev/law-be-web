import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from '../logging/logger.service';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class BusinessLoggerInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(private readonly prometheusService: PrometheusService) {
    this.logger = new LoggerService('Business');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    // Define business-critical endpoints
    const businessEndpoints = [
      '/admin',
      '/staff',
      '/services',
      '/blogs',
      '/contact',
    ];

    const isBusinessEndpoint = businessEndpoints.some(endpoint => url.includes(endpoint));

    if (!isBusinessEndpoint) {
      return next.handle();
    }

    const startTime = Date.now();
    const entity = this.extractEntity(url);
    const operation = this.mapMethodToOperation(method);

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - startTime;
        const entityId = response?.id || this.extractIdFromUrl(url);

        // Log business operation
        this.logger.logBusinessOperation(
          operation,
          entity,
          entityId,
          user?.id,
          { duration, method, url },
        );

        // Track Prometheus metrics
        this.prometheusService.businessOperationsTotal.inc({
          operation,
          entity,
          status: 'success',
        });

        this.prometheusService.businessOperationDuration.observe(
          { operation, entity },
          duration,
        );

        // Log data export operations
        if (url.includes('/export') || url.includes('/download')) {
          this.logger.logAuditEvent('DATA_EXPORT', user?.id || 'system', entity, {
            url,
            duration,
          });
        }

        // Log bulk operations
        if (body && Array.isArray(body) && body.length > 1) {
          this.logger.logBusinessOperation(
            'BULK_' + operation,
            entity,
            'multiple',
            user?.id,
            { itemCount: body.length, duration },
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Track failed operations
        this.prometheusService.businessOperationsTotal.inc({
          operation,
          entity,
          status: 'failed',
        });

        // Log business logic errors
        this.logger.error(`Business error: ${operation} ${entity}`, error.stack, {
          method,
          url,
          userId: user?.id,
          duration,
          statusCode: error.status,
        });

        // Log validation errors
        if (error.status === 400) {
          this.prometheusService.validationErrorsTotal.inc({
            field: 'unknown',
            constraint: 'validation_failed',
          });

          this.logger.warn('Validation error', {
            method,
            url,
            userId: user?.id,
            body: this.sanitizeBody(body),
          });
        }

        // Log not found errors
        if (error.status === 404) {
          this.logger.warn('Resource not found', {
            method,
            url,
            userId: user?.id,
            entity,
          });
        }

        this.prometheusService.errorsTotal.inc({
          type: 'business',
          severity: error.status >= 500 ? 'error' : 'warning',
        });

        return throwError(() => error);
      }),
    );
  }

  private extractEntity(url: string): string {
    const parts = url.split('/').filter(p => p);
    return parts[0] || 'unknown';
  }

  private extractIdFromUrl(url: string): string {
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = url.match(uuidRegex);
    return match ? match[0] : 'unknown';
  }

  private mapMethodToOperation(method: string): string {
    const operationMap = {
      'POST': 'CREATE',
      'GET': 'READ',
      'PUT': 'UPDATE',
      'PATCH': 'UPDATE',
      'DELETE': 'DELETE',
    };
    return operationMap[method] || method;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
