import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';
import { ContactEntity } from '@shared/entities';
import { EmailService } from '@shared/services/email.service';
import { CommonModule } from '@module/client/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity]), CommonModule],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository, EmailService],
  exports: [ContactService],
})
export class ContactModule {}

