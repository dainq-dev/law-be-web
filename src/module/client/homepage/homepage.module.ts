import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';
import {
  HumanResourceEntity,
  ServiceEntity,
  BlogEntity,
  WebConfigEntity,
} from '@shared/entities';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HumanResourceEntity,
      ServiceEntity,
      BlogEntity,
      WebConfigEntity,
    ]),
    CommonModule,
  ],
  controllers: [HomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}

