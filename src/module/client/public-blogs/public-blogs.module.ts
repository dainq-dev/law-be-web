import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicBlogsController } from './public-blogs.controller';
import { PublicBlogsService } from './public-blogs.service';
import { PublicBlogsRepository } from './public-blogs.repository';
import {
  BlogEntity,
} from '@shared/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
    ]),
  ],
  controllers: [PublicBlogsController],
  providers: [PublicBlogsService, PublicBlogsRepository],
  exports: [PublicBlogsService],
})
export class PublicBlogsModule {}
