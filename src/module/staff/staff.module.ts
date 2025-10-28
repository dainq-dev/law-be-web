import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HumanResourcesController } from './staff.controller';
import { HumanResourcesService } from './staff.service';
import { HumanResourcesRepository } from './staff.repository';
import { HumanResourceEntity, EducationEntity, ExperienceEntity, CertificateEntity, HumanResourceTranslationEntity, LanguageEntity } from '@shared/entities';
import { TranslationService } from '@shared/services/translation.service';
import { LanguageService } from '@shared/services/language.service';
import { UploadService } from '@shared/services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HumanResourceEntity, 
      EducationEntity, 
      ExperienceEntity,
      CertificateEntity,
      HumanResourceTranslationEntity,
      LanguageEntity
    ]),
  ],
  controllers: [HumanResourcesController],
  providers: [
    HumanResourcesService, 
    HumanResourcesRepository,
    TranslationService,
    LanguageService,
    UploadService
  ],
  exports: [HumanResourcesService],
})
export class HumanResourcesModule {}
