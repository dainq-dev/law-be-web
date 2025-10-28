import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logging/logger.service';
import { PrometheusService } from '../monitoring/prometheus.service';
import { LoggingConfig } from '../config/logging.config';

@Injectable()
export class DatabaseLoggerInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(private readonly prometheusService: PrometheusService) {
    this.logger = new LoggerService('Database');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;
    const now = Date.now();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;

        // Log to Winston with structured data
        if (duration > LoggingConfig.application.slowRequestThreshold || statusCode >= 400) {
          this.logger.logApiCall(method, url, statusCode, duration, {
            userId: user?.id,
            ip,
            userAgent: request.headers['user-agent'],
          });
        }

        // Track Prometheus metrics
        const route = this.extractRoute(url);
        this.prometheusService.httpRequestsTotal.inc({
          method,
          route,
          status_code: statusCode,
        });

        this.prometheusService.httpRequestDuration.observe(
          { method, route, status_code: statusCode },
          duration,
        );

        // Log slow queries
        if (duration > LoggingConfig.application.slowRequestThreshold) {
          this.logger.logPerformance('HTTP Request', duration, {
            method,
            url,
            statusCode,
            userId: user?.id,
          });
        }
      }),
    );
  }

  private extractRoute(url: string): string {
    // Remove query parameters and extract base route
    const baseUrl = url.split('?')[0];
    // Replace UUID patterns with :id
    return baseUrl.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id');
  }
}
