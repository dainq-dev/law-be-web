import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';
import { Public } from '@module/auth/decorators/public.decorator';
import * as os from 'os';

@ApiTags('Health & Monitoring')
@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prometheusService: PrometheusService,
  ) {}

  /**
   * Get the appropriate disk path for the current operating system
   */
  private getDiskPath(): string {
    const platform = os.platform();
    
    if (platform === 'win32') {
      // On Windows, use the current working directory's drive
      const cwd = process.cwd();
      return cwd.substring(0, 3); // Get drive letter (e.g., "C:\")
    } else {
      // On Unix-like systems (Linux, macOS), use root
      return '/';
    }
  }

  @Get('health')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check endpoint for load balancer' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024), // 500MB
      () =>
        this.disk.checkStorage('storage', {
          path: this.getDiskPath(),
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @Get('health/live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  checkLive() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ready')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  checkReady() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('metrics')
  @Public()
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'Prometheus metrics in text format',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async getMetrics() {
    return this.prometheusService.getMetrics();
  }
}

