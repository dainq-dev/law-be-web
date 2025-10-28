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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HumanResourceEntity,
      ServiceEntity,
      BlogEntity,
      WebConfigEntity,
    ]),
  ],
  controllers: [HomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}

