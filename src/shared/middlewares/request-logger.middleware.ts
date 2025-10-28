import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LoggerService } from '../logging/logger.service';
import { PrometheusService } from '../monitoring/prometheus.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger: LoggerService;

  constructor(private readonly prometheusService: PrometheusService) {
    this.logger = new LoggerService('HTTP');
  }

  use(req: Request | FastifyRequest, res: Response | FastifyReply, next: NextFunction) {
    const startTime = Date.now();
    const { method, url } = req as any;
    const userAgent = (req.headers as any)['user-agent'] || 'unknown';
    const ip = this.getClientIp(req as any);

    // Handle response completion
    const originalSend = (res as any).send;
    (res as any).send = function (body: any) {
      const duration = Date.now() - startTime;
      const statusCode = (res as any).statusCode || 200;
      const contentLength = body ? JSON.stringify(body).length : 0;

      // Log to Winston
      const logger = new LoggerService('HTTP');
      logger.logApiCall(method, url, statusCode, duration, {
        ip,
        userAgent,
        contentLength,
      });

      // Update Prometheus metrics
      const route = extractRoute(url);
      
      // HTTP Request metrics
      logger['prometheusService']?.httpRequestsTotal.inc({
        method,
        route,
        status_code: statusCode,
      });

      logger['prometheusService']?.httpRequestDuration.observe(
        { method, route, status_code: statusCode },
        duration,
      );

      if (contentLength > 0) {
        logger['prometheusService']?.httpResponseSize.observe(
          { method, route },
          contentLength,
        );
      }

      return originalSend.call(this, body);
    };

    // Track request size
    const requestSize = req.headers['content-length']
      ? parseInt(req.headers['content-length'] as string, 10)
      : 0;

    if (requestSize > 0) {
      this.prometheusService.httpRequestSize.observe(
        { method, route: extractRoute(url) },
        requestSize,
      );
    }

    next();
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
}

function extractRoute(url: string): string {
  // Remove query parameters
  const baseUrl = url.split('?')[0];
  // Replace UUID patterns with :id
  return baseUrl.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id');
}

