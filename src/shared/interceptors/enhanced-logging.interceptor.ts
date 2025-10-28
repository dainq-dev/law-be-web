import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EnhancedLoggerService } from '../logging/enhanced-logger.service';

@Injectable()
export class EnhancedLoggingInterceptor implements NestInterceptor {
  private readonly logger: EnhancedLoggerService;

  constructor() {
    this.logger = new EnhancedLoggerService('API-Interceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, requestId } = request;
    const startTime = Date.now();

    // Create request-specific logger
    const requestLogger = this.logger.createRequestLogger(requestId, 'API-Request');

    // Log controller method start
    const handler = context.getHandler();
    const controller = context.getClass();
    const controllerName = controller.name;
    const methodName = handler.name;

    requestLogger.log('🎯 Controller Method Started', {
      controller: controllerName,
      method: methodName,
      type: 'controller_start'
    });

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - startTime;
        
        // Log successful completion
        requestLogger.log('✅ Controller Method Completed', {
          controller: controllerName,
          method: methodName,
          duration: `${duration}ms`,
          type: 'controller_complete'
        });

        // Log performance if slow
        if (duration > 1000) {
          requestLogger.logPerformance(requestId, 'Controller Method', duration, {
            controller: controllerName,
            method: methodName,
          });
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        // Log error with context
        requestLogger.logError(requestId, error, 'Controller Method', {
          controller: controllerName,
          method: methodName,
          duration: `${duration}ms`,
        });

        return throwError(() => error);
      })
    );
  }
}
