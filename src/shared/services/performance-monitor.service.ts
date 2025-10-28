import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PerformanceMonitorService implements OnModuleInit {
  private readonly logger = new Logger('Performance');
  private readonly startTime = Date.now();
  private memoryCheckInterval: NodeJS.Timeout;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Log application startup time
    const startupTime = Date.now() - this.startTime;
    this.logger.log(`🚀 Application started in ${startupTime}ms`);

    // Start memory monitoring in development
    if (this.configService.get('NODE_ENV') === 'development') {
      this.startMemoryMonitoring();
    }
  }

  private startMemoryMonitoring() {
    this.memoryCheckInterval = setInterval(() => {
      const memUsage = process.memoryUsage();
      const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
      };

      // Log memory usage every 5 minutes
      this.logger.debug(
        `💾 Memory Usage - RSS: ${memUsageMB.rss}MB, Heap: ${memUsageMB.heapUsed}/${memUsageMB.heapTotal}MB, External: ${memUsageMB.external}MB`
      );

      // Warn if memory usage is high
      if (memUsageMB.heapUsed > 500) { // 500MB threshold
        this.logger.warn(
          `⚠️ High memory usage detected: ${memUsageMB.heapUsed}MB`
        );
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  logSlowOperation(operation: string, duration: number, threshold: number = 1000) {
    if (duration > threshold) {
      this.logger.warn(
        `🐌 Slow operation detected: ${operation} took ${duration}ms (threshold: ${threshold}ms)`
      );
    }
  }

  logDatabaseStats(stats: {
    totalQueries: number;
    slowQueries: number;
    avgResponseTime: number;
  }) {
    this.logger.log(
      `📊 Database Stats - Total: ${stats.totalQueries}, Slow: ${stats.slowQueries}, Avg: ${stats.avgResponseTime}ms`
    );
  }

  logApiStats(stats: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
  }) {
    this.logger.log(
      `📈 API Stats - Requests: ${stats.totalRequests}, Success: ${stats.successRate}%, Avg: ${stats.avgResponseTime}ms`
    );
  }

  onModuleDestroy() {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
  }
}
