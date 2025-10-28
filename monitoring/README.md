# Monitoring & Observability

Hệ thống monitoring và observability cho BE-LAW-OFFICIAL sử dụng Prometheus, Grafana, và Loki.

## Cấu trúc

```
monitoring/
├── prometheus.yml          # Prometheus configuration
├── loki-config.yml        # Loki configuration
├── promtail-config.yml    # Promtail configuration
├── grafana/
│   ├── dashboards/        # Grafana dashboard JSON files
│   └── datasources/       # Grafana datasource configurations
└── README.md
```

## Khởi động Monitoring Stack

### 1. Sử dụng Docker Compose

```bash
# Khởi động tất cả services
docker-compose -f docker-compose.monitoring.yml up -d

# Xem logs
docker-compose -f docker-compose.monitoring.yml logs -f

# Dừng services
docker-compose -f docker-compose.monitoring.yml down
```

### 2. Truy cập các services

- **Grafana**: http://localhost:3001
  - Username: `admin`
  - Password: `admin`

- **Prometheus**: http://localhost:9090

- **Loki**: http://localhost:3100

## Endpoints của Application

### Metrics Endpoint
```
GET http://localhost:3000/metrics
```
Trả về Prometheus metrics ở format text.

### Health Check Endpoints
```
GET http://localhost:3000/health        # Full health check
GET http://localhost:3000/health/live   # Liveness probe
GET http://localhost:3000/health/ready  # Readiness probe
```

## Prometheus Metrics

### HTTP Metrics
- `http_requests_total` - Tổng số requests (labels: method, route, status_code)
- `http_request_duration_ms` - Thời gian xử lý request (histogram)
- `http_request_size_bytes` - Kích thước request
- `http_response_size_bytes` - Kích thước response

### Business Metrics
- `business_operations_total` - Số lượng operations (labels: operation, entity, status)
- `business_operation_duration_ms` - Thời gian xử lý operation

### Authentication Metrics
- `auth_attempts_total` - Số lần đăng nhập
- `auth_success_total` - Số lần đăng nhập thành công
- `auth_failed_total` - Số lần đăng nhập thất bại (labels: reason)

### Error Metrics
- `errors_total` - Tổng số errors (labels: type, severity)
- `validation_errors_total` - Lỗi validation (labels: field, constraint)

### Database Metrics
- `database_queries_total` - Số lượng queries
- `database_query_duration_ms` - Thời gian query
- `database_connections_active` - Số connections active

### Resource Metrics
- `active_users_total` - Số users đang hoạt động
- `staff_total`, `services_total`, `blogs_total` - Số lượng resources

## Grafana Dashboards

### Recommended Dashboards

1. **API Overview**
   - Request rate
   - Response time
   - Error rate
   - Status code distribution

2. **Business Operations**
   - CRUD operations by entity
   - Operation duration
   - Success/failure rates

3. **Authentication & Security**
   - Login attempts
   - Failed logins
   - Security events
   - Admin actions

4. **Database Performance**
   - Query count
   - Slow queries
   - Connection pool usage

5. **Error Tracking**
   - Error trends
   - Error types distribution
   - Recent errors

6. **System Health**
   - CPU usage
   - Memory usage
   - Disk usage
   - Network I/O

## Loki Log Queries

### Example Queries

#### Tìm errors trong 1 giờ qua
```logql
{job="be-law-api", log_type="error"} |= "error" | json
```

#### Tìm failed login attempts
```logql
{job="be-law-api", log_type="security"} |= "Login failed" | json
```

#### Slow API requests (>1000ms)
```logql
{job="be-law-api", log_type="access"} | json | duration > 1000
```

#### Database errors
```logql
{job="be-law-api", log_type="database"} |= "error" | json
```

#### Admin actions
```logql
{job="be-law-api", log_type="audit"} |= "ADMIN_" | json
```

## Alerting (Optional)

### Prometheus Alert Rules

Tạo file `monitoring/alerts/api-alerts.yml`:

```yaml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/second"

      # Slow responses
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m])) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time > 1s"

      # Database connection issues
      - alert: DatabaseConnectionLow
        expr: database_connections_active < 2
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Low database connections"

      # High failed login rate
      - alert: HighFailedLoginRate
        expr: rate(auth_failed_total[5m]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High failed login rate detected"
          description: "Possible brute force attack"
```

## Best Practices

### 1. Log Retention
- Application logs: 14 days
- Error logs: 30 days
- Security logs: 90 days
- Audit logs: 90 days

### 2. Metrics Retention
- Prometheus: 15 days (configurable)

### 3. Query Optimization
- Use specific labels in queries
- Limit time range when possible
- Use recording rules for complex queries

### 4. Dashboard Organization
- Group related metrics
- Use variables for filtering
- Add annotations for deployments
- Include documentation links

## Troubleshooting

### Logs không hiển thị trong Loki
1. Kiểm tra Promtail logs: `docker logs be-law-promtail`
2. Verify log file paths in promtail-config.yml
3. Check Loki is running: `curl http://localhost:3100/ready`

### Metrics không có trong Prometheus
1. Kiểm tra `/metrics` endpoint của app: `curl http://localhost:3000/metrics`
2. Verify Prometheus scrape config
3. Check Prometheus targets: http://localhost:9090/targets

### Grafana không kết nối datasources
1. Kiểm tra datasource configuration
2. Verify network connectivity trong Docker
3. Check datasource URLs (use service names in Docker network)

## Production Recommendations

1. **Use persistent volumes** cho data storage
2. **Configure resource limits** trong Docker
3. **Setup backup** cho Grafana dashboards và Prometheus data
4. **Enable authentication** cho tất cả services
5. **Use reverse proxy** (Nginx/Traefik) cho external access
6. **Setup alerting** với Alertmanager
7. **Regular maintenance** - cleanup old data, rotate logs

