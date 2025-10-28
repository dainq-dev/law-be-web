import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebConfigController } from './web-config.controller';
import { WebConfigService } from './web-config.service';
import { WebConfigRepository } from './web-config.repository';
import { WebConfigEntity } from '@shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([WebConfigEntity])],
  controllers: [WebConfigController],
  providers: [WebConfigService, WebConfigRepository],
  exports: [WebConfigService],
})
export class WebConfigModule {}

