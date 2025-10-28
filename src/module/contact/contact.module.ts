import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactRepository } from './contact.repository';
import { ContactEntity } from '@shared/entities';
import { EmailService } from '@shared/services/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity])],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository, EmailService],
  exports: [ContactService],
})
export class ContactModule {}

