import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { PaginationOptions } from '@shared/utilities/pagination';
import { plainToClass } from 'class-transformer';
import { EmailService } from '@shared/services/email.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
} from './dto';
import { ContactEntity } from '@shared/entities';
import { CommonRepository } from '@module/client/common/common.repository';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly commonRepository: CommonRepository,

  ) {}

  private async checkWebsiteEnabled(): Promise<void> {
    const isEnabled = await this.commonRepository.isWebsiteEnabled();
    if (!isEnabled) {
      throw new ServiceUnavailableException(
        'Website is currently disabled. Please contact the administrator.',
      );
    }
  }

  async create(
    createContactDto: CreateContactDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    await this.checkWebsiteEnabled();
    const contactData = {
      ...createContactDto,
      ip_address: ipAddress,
      user_agent: userAgent,
    };
    await this.contactRepository.create(contactData);
    return 'Contact created successfully';
  }

  async findAll(
  ): Promise<ContactResponseDto[]> {
    try {
      const result = await this.contactRepository.findAll();
      return result.map(contact => this.toContactResponseDto(contact));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<ContactResponseDto> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return this.toContactResponseDto(contact);
  }

  private toContactResponseDto(contact: ContactEntity): ContactResponseDto {
    return plainToClass(ContactResponseDto, contact, {
      excludeExtraneousValues: true,
    });
  }
}

