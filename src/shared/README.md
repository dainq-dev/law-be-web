# Shared Modules

This directory contains shared components, utilities, and services used across the application.

## Directory Structure

```
shared/
├── common/              # Common utilities (bcrypt, etc.)
├── config/              # Application configurations
│   └── logging.config.ts
├── constants/           # Application constants
│   └── date-format.ts
├── decorators/          # Custom decorators
│   └── audit-log.decorator.ts
├── dto/                 # Shared Data Transfer Objects
│   ├── language.dto.ts
│   ├── pagination.dto.ts
│   ├── query.dto.ts
│   └── translation.dto.ts
├── entities/            # TypeORM entities
│   ├── admin.entity.ts
│   ├── blog.entity.ts
│   ├── staff.entity.ts
│   └── ...
├── interceptors/        # Global interceptors
│   ├── business-logger.interceptor.ts
│   ├── database-logger.interceptor.ts
│   ├── error-logger.interceptor.ts
│   └── security-logger.interceptor.ts
├── interface/           # TypeScript interfaces
│   ├── pagination.interface.ts
│   └── token.interface.ts
├── logging/             # Winston logging system
│   ├── logger.service.ts
│   ├── winston.config.ts
│   └── index.ts
├── middlewares/         # Express/Fastify middlewares
│   ├── request-logger.middleware.ts
│   └── index.ts
├── monitoring/          # Prometheus metrics & health checks
│   ├── prometheus.service.ts
│   ├── health.controller.ts
│   ├── monitoring.module.ts
│   └── index.ts
├── services/            # Shared services
│   ├── email.service.ts
│   ├── language.service.ts
│   ├── performance-monitor.service.ts
│   ├── translation.service.ts
│   ├── typeorm-logger.service.ts
│   └── upload.service.ts
└── utilities/           # Utility functions
    ├── audit-logger.ts
    ├── date.ts
    ├── json-token.ts
    ├── pagination.ts
    ├── password.ts
    ├── response.ts
    └── validation.ts
```

## Logging System

### Winston Logger
- **Location**: `shared/logging/`
- **Features**:
  - Structured JSON logging for easy parsing by Grafana/Loki
  - Daily log rotation
  - Separate log files by type (application, error, security, audit, access, database)
  - Configurable log levels
  - Context-aware logging

### Usage
```typescript
import { LoggerService } from '@shared/logging';

const logger = new LoggerService('MyContext');

// Structured logging
logger.logApiCall(method, url, statusCode, duration, metadata);
logger.logSecurityEvent(event, userId, ip, metadata);
logger.logAuditEvent(action, userId, resource, metadata);
logger.logBusinessOperation(operation, entity, entityId, userId, metadata);
logger.logPerformance(operation, duration, metadata);

// Standard logging
logger.log('message', metadata);
logger.error('message', trace, metadata);
logger.warn('message', metadata);
logger.debug('message', metadata);
```

## Monitoring & Metrics

### Prometheus Metrics
- **Location**: `shared/monitoring/`
- **Endpoints**:
  - `GET /metrics` - Prometheus metrics endpoint
  - `GET /health` - Health check for load balancers
  - `GET /health/live` - Kubernetes liveness probe
  - `GET /health/ready` - Kubernetes readiness probe

### Available Metrics
- **HTTP Metrics**:
  - `http_requests_total` - Total HTTP requests
  - `http_request_duration_ms` - Request duration histogram
  - `http_request_size_bytes` - Request size histogram
  - `http_response_size_bytes` - Response size histogram

- **Database Metrics**:
  - `database_queries_total` - Total database queries
  - `database_query_duration_ms` - Query duration histogram
  - `database_connections_active` - Active connections gauge

- **Business Metrics**:
  - `business_operations_total` - Total business operations
  - `business_operation_duration_ms` - Operation duration histogram

- **Authentication Metrics**:
  - `auth_attempts_total` - Total auth attempts
  - `auth_success_total` - Successful authentications
  - `auth_failed_total` - Failed authentications

- **Error Metrics**:
  - `errors_total` - Total errors by type and severity
  - `validation_errors_total` - Validation errors by field

- **Resource Metrics**:
  - `active_users_total` - Active users gauge
  - `staff_total`, `services_total`, `blogs_total` - Resource counts

## Interceptors

### DatabaseLoggerInterceptor
Logs all HTTP requests with Winston and tracks Prometheus metrics.

### SecurityLoggerInterceptor
Logs security-sensitive operations (login, password changes, admin actions).

### BusinessLoggerInterceptor
Logs business operations (CRUD operations, data exports, bulk operations).

### ErrorLoggerInterceptor
Catches and logs all errors with appropriate context and metrics.

## Log Files

All logs are stored in `logs/` directory:
- `application-YYYY-MM-DD.log` - General application logs
- `error-YYYY-MM-DD.log` - Error logs (kept for 30 days)
- `security-YYYY-MM-DD.log` - Security events (kept for 90 days)
- `audit-YYYY-MM-DD.log` - Audit trail (kept for 90 days)
- `access-YYYY-MM-DD.log` - API access logs
- `database-YYYY-MM-DD.log` - Database query logs

## Configuration

Environment variables for logging:
```env
NODE_ENV=development|production
LOG_LEVEL=debug|info|warn|error
DATABASE_LOG_QUERIES=true|false
```

## Grafana Integration

### Loki Configuration
The JSON structured logs can be easily ingested by Grafana Loki:

```yaml
# promtail-config.yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: be-law-official
    static_configs:
      - targets:
          - localhost
        labels:
          job: be-law-official
          __path__: /app/logs/*.log
```

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'be-law-official'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

