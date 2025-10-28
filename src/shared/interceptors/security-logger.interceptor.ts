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
export class SecurityLoggerInterceptor implements NestInterceptor {
  private readonly logger: LoggerService;

  constructor(private readonly prometheusService: PrometheusService) {
    this.logger = new LoggerService('Security');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip } = request;

    // Log security-sensitive endpoints
    const securityEndpoints = [
      '/auth/login',
      '/auth/refresh',
      '/auth/logout',
      '/admin/change-password',
      '/admin/reset-password',
    ];

    const isSecurityEndpoint = securityEndpoints.some(endpoint => url.includes(endpoint));

    if (isSecurityEndpoint) {
      this.logger.logSecurityEvent('Security endpoint accessed', user?.id, ip, {
        method,
        url,
      });

      // Track auth attempts
      if (url.includes('/auth/login')) {
        this.prometheusService.authAttemptsTotal.inc({ method: 'login' });
      }
    }

    return next.handle().pipe(
      tap((response) => {
        // Log successful authentication
        if (url.includes('/auth/login') && response?.access_token) {
          this.logger.logSecurityEvent('Login successful', user?.id || body?.user_email, ip, {
            email: body?.user_email,
          });
          
          this.prometheusService.authSuccessTotal.inc({ method: 'login' });
        }

        // Log password changes
        if (url.includes('/change-password')) {
          this.logger.logSecurityEvent('Password changed', user?.id, ip);
          
          this.logger.logAuditEvent('PASSWORD_CHANGE', user?.id, 'admin', {
            ip,
            timestamp: new Date().toISOString(),
          });
        }

        // Log admin actions
        if (url.includes('/admin') && user?.id) {
          this.logger.logSecurityEvent('Admin action', user.id, ip, {
            method,
            url,
            action: method,
          });

          this.logger.logAuditEvent(`ADMIN_${method}`, user.id, url, {
            ip,
            timestamp: new Date().toISOString(),
          });
        }
      }),
      catchError((error) => {
        // Log failed authentication attempts
        if (url.includes('/auth/login')) {
          this.logger.logSecurityEvent('Login failed', undefined, ip, {
            email: body?.user_email,
            reason: error.message,
          });
          
          this.prometheusService.authFailedTotal.inc({
            method: 'login',
            reason: error.status === 401 ? 'invalid_credentials' : 'error',
          });
        }

        // Log unauthorized access attempts
        if (error.status === 401 || error.status === 403) {
          this.logger.logSecurityEvent('Unauthorized access attempt', user?.id, ip, {
            method,
            url,
            statusCode: error.status,
          });

          this.prometheusService.errorsTotal.inc({
            type: 'unauthorized',
            severity: 'warning',
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
