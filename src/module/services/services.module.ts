import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { ServiceEntity, ServiceTranslationEntity, LanguageEntity } from '@shared/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, ServiceTranslationEntity, LanguageEntity]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
