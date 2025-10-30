import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HumanResourcesController } from './staff.controller';
import { HumanResourcesService } from './staff.service';
import { HumanResourcesRepository } from './staff.repository';
import { HumanResourceEntity, EducationEntity, ExperienceEntity, CertificateEntity } from '@shared/entities';
import { UploadService } from '@shared/services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HumanResourceEntity, 
      EducationEntity, 
      ExperienceEntity,
      CertificateEntity
    ]),
  ],
  controllers: [HumanResourcesController],
  providers: [
    HumanResourcesService, 
    HumanResourcesRepository,
    UploadService
  ],
  exports: [HumanResourcesService],
})
export class HumanResourcesModule {}
