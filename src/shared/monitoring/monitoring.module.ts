import { Module, Global } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusService } from './prometheus.service';
import { HealthController } from './health.controller';

@Global()
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class MonitoringModule {}

