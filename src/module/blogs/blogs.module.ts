import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import {
  BlogEntity,
  PostBlockEntity,
} from '@shared/entities';
import { UploadService } from '@shared/services/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogEntity,
      PostBlockEntity,
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, UploadService],
  exports: [BlogsService],
})
export class BlogsModule {}

