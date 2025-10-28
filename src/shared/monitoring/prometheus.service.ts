import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly registry: Registry;
  
  // HTTP Metrics
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;
  public readonly httpRequestSize: Histogram;
  public readonly httpResponseSize: Histogram;
  
  // Database Metrics
  public readonly databaseQueriesTotal: Counter;
  public readonly databaseQueryDuration: Histogram;
  public readonly databaseConnectionsActive: Gauge;
  
  // Business Metrics
  public readonly businessOperationsTotal: Counter;
  public readonly businessOperationDuration: Histogram;
  
  // Authentication Metrics
  public readonly authAttemptsTotal: Counter;
  public readonly authSuccessTotal: Counter;
  public readonly authFailedTotal: Counter;
  
  // Error Metrics
  public readonly errorsTotal: Counter;
  public readonly validationErrorsTotal: Counter;
  
  // Resource Metrics
  public readonly activeUsersGauge: Gauge;
  public readonly staffTotalGauge: Gauge;
  public readonly servicesTotalGauge: Gauge;
  public readonly blogsTotalGauge: Gauge;
  
  constructor() {
    this.registry = new Registry();
    
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register: this.registry });
    
    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
    
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in milliseconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
      registers: [this.registry],
    });
    
    this.httpRequestSize = new Histogram({
      name: 'http_request_size_bytes',
      help: 'Size of HTTP requests in bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.registry],
    });
    
    this.httpResponseSize = new Histogram({
      name: 'http_response_size_bytes',
      help: 'Size of HTTP responses in bytes',
      labelNames: ['method', 'route'],
      buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
      registers: [this.registry],
    });
    
    // Database Metrics
    this.databaseQueriesTotal = new Counter({
      name: 'database_queries_total',
      help: 'Total number of database queries',
      labelNames: ['type', 'table', 'status'],
      registers: [this.registry],
    });
    
    this.databaseQueryDuration = new Histogram({
      name: 'database_query_duration_ms',
      help: 'Duration of database queries in milliseconds',
      labelNames: ['type', 'table'],
      buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      registers: [this.registry],
    });
    
    this.databaseConnectionsActive = new Gauge({
      name: 'database_connections_active',
      help: 'Number of active database connections',
      registers: [this.registry],
    });
    
    // Business Metrics
    this.businessOperationsTotal = new Counter({
      name: 'business_operations_total',
      help: 'Total number of business operations',
      labelNames: ['operation', 'entity', 'status'],
      registers: [this.registry],
    });
    
    this.businessOperationDuration = new Histogram({
      name: 'business_operation_duration_ms',
      help: 'Duration of business operations in milliseconds',
      labelNames: ['operation', 'entity'],
      buckets: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
      registers: [this.registry],
    });
    
    // Authentication Metrics
    this.authAttemptsTotal = new Counter({
      name: 'auth_attempts_total',
      help: 'Total number of authentication attempts',
      labelNames: ['method'],
      registers: [this.registry],
    });
    
    this.authSuccessTotal = new Counter({
      name: 'auth_success_total',
      help: 'Total number of successful authentications',
      labelNames: ['method'],
      registers: [this.registry],
    });
    
    this.authFailedTotal = new Counter({
      name: 'auth_failed_total',
      help: 'Total number of failed authentications',
      labelNames: ['method', 'reason'],
      registers: [this.registry],
    });
    
    // Error Metrics
    this.errorsTotal = new Counter({
      name: 'errors_total',
      help: 'Total number of errors',
      labelNames: ['type', 'severity'],
      registers: [this.registry],
    });
    
    this.validationErrorsTotal = new Counter({
      name: 'validation_errors_total',
      help: 'Total number of validation errors',
      labelNames: ['field', 'constraint'],
      registers: [this.registry],
    });
    
    // Resource Metrics
    this.activeUsersGauge = new Gauge({
      name: 'active_users_total',
      help: 'Number of active users',
      registers: [this.registry],
    });
    
    this.staffTotalGauge = new Gauge({
      name: 'staff_total',
      help: 'Total number of staff members',
      registers: [this.registry],
    });
    
    this.servicesTotalGauge = new Gauge({
      name: 'services_total',
      help: 'Total number of services',
      registers: [this.registry],
    });
    
    this.blogsTotalGauge = new Gauge({
      name: 'blogs_total',
      help: 'Total number of blog posts',
      registers: [this.registry],
    });
  }
  
  getRegistry(): Registry {
    return this.registry;
  }
  
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

