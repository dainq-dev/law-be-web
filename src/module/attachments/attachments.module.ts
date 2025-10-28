import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsEntity } from '../../shared/entities/attachments.entity';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { AttachmentHelperService } from './attachment-helper.service';
import { UploadService } from '../../shared/services/upload.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttachmentsEntity]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService, AttachmentHelperService, UploadService],
  exports: [AttachmentsService, AttachmentHelperService],
})
export class AttachmentsModule {}
