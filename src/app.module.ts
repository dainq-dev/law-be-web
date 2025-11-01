import { Module, MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppDataSource } from '@config/database/typeorm.config';
import { MainController } from './app.controller';
import { AdminEntity, RoleEntity, PermissionEntity } from '@shared/entities';
import { AttachmentsEntity } from '@shared/entities/attachments.entity';
import { AuthModule } from './module/auth/auth.module';
import { AdminModule } from './module/admin/admin.module';
import { HumanResourcesModule } from './module/staff/staff.module';
import { ServicesModule } from './module/services/services.module';
import { BlogsModule } from './module/blogs/blogs.module';
import { WebConfigModule } from './module/web-config/web-config.module';
import { ContactModule } from './module/contact/contact.module';
import { HomepageModule } from './module/client/homepage/homepage.module';
import { PublicBlogsModule } from './module/client/public-blogs/public-blogs.module';
import { AttachmentsModule } from './module/attachments/attachments.module';
import { MonitoringModule } from '@shared/monitoring/monitoring.module';
import { EnhancedLoggingInterceptor } from '@shared/interceptors/enhanced-logging.interceptor';
import { EnhancedRequestLoggerMiddleware } from '@shared/middlewares/enhanced-request-logger.middleware';
import { SmartLoggerService } from '@shared/logging/smart-logger.service';
import { LoggingConfigService } from '@shared/logging/logging-config.service';
import { PerformanceMonitorService } from '@shared/services/performance-monitor.service';
import { PublicStaffModule } from '@module/client/staff/staff.module';
import { CommonModule } from '@module/client/common/common.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...AppDataSource }),
    TypeOrmModule.forFeature([AdminEntity, RoleEntity, PermissionEntity, AttachmentsEntity]),
    MonitoringModule,
    AuthModule,
    AdminModule,
    HumanResourcesModule,
    ServicesModule,
    BlogsModule,
    WebConfigModule,
    ContactModule,
    HomepageModule,
    PublicBlogsModule,
    PublicStaffModule,
    CommonModule,
    AttachmentsModule,
  ],
  controllers: [MainController],
  providers: [
    PerformanceMonitorService,
    AppService,
    SmartLoggerService,
    LoggingConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EnhancedLoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly appService: AppService) {}
   async onModuleInit() {
    // Chỉ chạy seed khi không có admin user nào (lần đầu tiên)
    try {
      console.log('🌱 Checking database seeding...');
      await this.appService.seeds();
      console.log('✅ Database seeding completed successfully');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      // Không throw error để không làm crash app
      // Nếu muốn bắt buộc seed thành công mới chạy app thì uncomment dòng dưới:
      // throw error;
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnhancedRequestLoggerMiddleware)
      .forRoutes('*');
  }
}
