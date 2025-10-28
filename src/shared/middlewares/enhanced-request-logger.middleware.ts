import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../logging/logger.service';
import { RequestIdUtil } from '../utilities/request-id.util';
import { LoggingConfig } from '../config/logging.config';

@Injectable()
export class EnhancedRequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('HTTP-Request');
  }

  use(req: Request | FastifyRequest, res: Response | FastifyReply, next: NextFunction) {
    const startTime = Date.now();
    const { method, url, headers } = req as any;
    
    // Generate or get request ID
    const requestId = RequestIdUtil.getOrCreate(req);
    
    // Set request ID in response headers
    RequestIdUtil.setResponseHeader(res, requestId);
    
    // Extract useful information
    const userAgent = headers['user-agent'] || 'unknown';
    const ip = this.getClientIp(req as any);
    const contentType = headers['content-type'] || 'unknown';
    const contentLength = headers['content-length'] ? parseInt(headers['content-length'], 10) : 0;
    
    // Log request start with clear structure
    this.logger.log('🚀 API Request Started', {
      requestId,
      method,
      url,
      ip,
      userAgent,
      contentType,
      contentLength,
      timestamp: new Date().toISOString(),
      type: 'request_start'
    });

    // Override response methods to log completion
    const originalSend = (res as any).send;
    const originalJson = (res as any).json;
    const originalEnd = (res as any).end;

    (res as any).send = function (body: any) {
      return this.logResponse(originalSend, body, startTime, requestId, method, url, res);
    }.bind(this);

    (res as any).json = function (body: any) {
      return this.logResponse(originalJson, body, startTime, requestId, method, url, res);
    }.bind(this);

    (res as any).end = function (body: any) {
      return this.logResponse(originalEnd, body, startTime, requestId, method, url, res);
    }.bind(this);

    // Add request ID to request object for use in other parts of the app
    (req as any).requestId = requestId;
    (req as any).startTime = startTime;

    next();
  }

  private logResponse(
    originalMethod: Function, 
    body: any, 
    startTime: number, 
    requestId: string, 
    method: string, 
    url: string, 
    res: any
  ) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode || 200;
    const responseSize = body ? JSON.stringify(body).length : 0;
    
    // Determine log level based on status and duration
    const isError = statusCode >= 400;
    const isSlow = duration > LoggingConfig.application.slowRequestThreshold;
    
    const logLevel = isError ? 'error' : (isSlow ? 'warn' : 'info');
    const emoji = isError ? '❌' : (isSlow ? '⚠️' : '✅');
    
    // Log response with clear structure
    this.logger.log('🚀 API Request Completed', {
      requestId,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      responseSize,
      isError,
      isSlow,
      timestamp: new Date().toISOString(),
      type: 'request_complete'
    });

    // Log slow requests with more detail
    if (isSlow) {
      this.logger.warn('🐌 Slow Request Detected', {
        requestId,
        method,
        url,
        duration: `${duration}ms`,
        threshold: `${LoggingConfig.application.slowRequestThreshold}ms`,
        type: 'slow_request'
      });
    }

    // Log errors with more detail
    if (isError) {
      this.logger.error('💥 API Error', undefined, {
        requestId,
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        errorType: this.getErrorType(statusCode),
        type: 'api_error'
      });
    }

    return originalMethod.call(res, body);
  }

  private getClientIp(req: any): string {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      'unknown'
    );
  }

  private getErrorType(statusCode: number): string {
    if (statusCode >= 500) return 'server_error';
    if (statusCode >= 400) return 'client_error';
    return 'unknown';
  }
}
