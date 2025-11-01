import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicBlogsController } from './public-blogs.controller';
import { PublicBlogsService } from './public-blogs.service';
import { PublicBlogsRepository } from './public-blogs.repository';
import {
  BlogEntity,
} from '@shared/entities';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
    ]),
    CommonModule,
  ],
  controllers: [PublicBlogsController],
  providers: [PublicBlogsService, PublicBlogsRepository],
  exports: [PublicBlogsService],
})
export class PublicBlogsModule {}
